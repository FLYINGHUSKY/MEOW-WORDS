(function () {
  'use strict';

  const config = window.MEOW_AUTH_CONFIG || {};
  const SESSION_KEY = 'meow-cet6-auth-session-v1';
  const isConfigured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl || '') && Boolean(config.supabasePublishableKey);
  const $ = selector => document.querySelector(selector);
  let mode = 'login';
  let currentSession = null;
  let syncTimer = 0;

  function setAuthMode(nextMode) {
    mode = nextMode;
    document.querySelectorAll('[data-auth-mode]').forEach(button => {
      const active = button.dataset.authMode === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    $('#confirmPasswordRow').hidden = mode !== 'register';
    $('#authWarning').hidden = mode !== 'register';
    $('#authPassword').autocomplete = mode === 'register' ? 'new-password' : 'current-password';
    $('#authTitle').textContent = mode === 'register' ? '注册猫猫账号' : '登录猫猫账号';
    $('#authSubmitBtn').textContent = mode === 'register' ? '创建账号并同步' : '登录';
    $('#authError').textContent = '';
  }

  function updateAccountUI() {
    const loggedIn = Boolean(currentSession?.user?.id);
    const username = currentSession?.username || currentSession?.user?.user_metadata?.username || '猫猫同学';
    $('#profileName').textContent = loggedIn ? username : '游客同学';
    $('#accountStatus').classList.toggle('online', loggedIn);
    $('#authForm').hidden = loggedIn || !isConfigured;
    $('#authSetup').hidden = isConfigured || loggedIn;
    $('#accountPanel').hidden = !loggedIn;
    $('#continueGuestBtn').textContent = loggedIn ? '返回学习' : '继续以游客身份使用';
    if (loggedIn) {
      $('#authTitle').textContent = '猫猫账号';
      $('#authSubtitle').textContent = '你的学习记录会安全保存在云端。';
      $('#accountUsername').textContent = username;
      $('#syncStatus').textContent = navigator.onLine ? '学习记录已同步' : '当前离线，将在联网后同步';
    } else {
      $('#authSubtitle').textContent = isConfigured ? '登录后可在不同设备继续学习，游客也能直接使用。' : '登录服务完成配置后开放，当前可继续使用游客模式。';
      setAuthMode(mode);
    }
  }

  function openDialog() {
    updateAccountUI();
    if (!$('#authDialog').open) $('#authDialog').showModal();
    if (!currentSession && isConfigured) setTimeout(() => $('#authUsername').focus(), 0);
  }

  function normalizedUsername(value) {
    return value.trim().normalize('NFKC').toLowerCase();
  }

  function validateCredentials(username, password, confirmation) {
    if (!/^[\p{L}\p{N}_-]{2,20}$/u.test(username)) return '用户名需为 2～20 个中文、字母、数字、下划线或短横线';
    if (password.length < 8 || password.length > 72) return '密码长度需为 8～72 位';
    if (mode === 'register' && password !== confirmation) return '两次输入的密码不一致';
    return '';
  }

  async function usernameToEmail(username) {
    const bytes = new TextEncoder().encode(normalizedUsername(username));
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const hash = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('').slice(0, 40);
    const domain = /^[a-z0-9.-]+$/i.test(config.usernameDomain || '') ? config.usernameDomain : 'users.meowwords.app';
    return `${hash}@${domain}`;
  }

  async function api(path, options = {}, accessToken = config.supabasePublishableKey) {
    const response = await fetch(`${config.supabaseUrl}${path}`, {
      ...options,
      headers: {
        apikey: config.supabasePublishableKey,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;
    if (!response.ok) throw new Error(payload?.msg || payload?.error_description || payload?.message || payload?.error || `请求失败（${response.status}）`);
    return payload;
  }

  function normalizeSession(payload, username) {
    return {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
      expires_at: Date.now() + Math.max(60, payload.expires_in || 3600) * 1000,
      user: payload.user,
      username: username || payload.user?.user_metadata?.username || '猫猫同学'
    };
  }

  function storeSession(session) {
    currentSession = session;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  async function ensureFreshSession() {
    if (!currentSession) throw new Error('登录状态已失效');
    if (currentSession.expires_at - Date.now() > 60000) return currentSession;
    const payload = await api('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      body: JSON.stringify({refresh_token: currentSession.refresh_token})
    });
    const refreshed = normalizeSession(payload, currentSession.username);
    storeSession(refreshed);
    return refreshed;
  }

  function clone(value) {
    return value ? JSON.parse(JSON.stringify(value)) : null;
  }

  function mergeStates(...sources) {
    const states = sources.filter(source => source && typeof source === 'object');
    const result = {dailyGoal: 10, progress: {}, activity: {}, totalReviews: 0, createdAt: Date.now(), updatedAt: Date.now()};
    let newest = 0;
    for (const source of states) {
      const updatedAt = Number(source.updatedAt || source.createdAt || 0);
      if (updatedAt >= newest && Number.isFinite(Number(source.dailyGoal))) {
        result.dailyGoal = Number(source.dailyGoal);
        newest = updatedAt;
      }
      result.createdAt = Math.min(result.createdAt, Number(source.createdAt || result.createdAt));
      result.updatedAt = Math.max(result.updatedAt, updatedAt);
      result.totalReviews = Math.max(result.totalReviews, Number(source.totalReviews || 0));
      for (const [wordId, candidate] of Object.entries(source.progress || {})) {
        const existing = result.progress[wordId];
        if (!existing || Number(candidate.lastReviewed || 0) >= Number(existing.lastReviewed || 0)) result.progress[wordId] = clone(candidate);
      }
      for (const [day, activity] of Object.entries(source.activity || {})) {
        const existing = result.activity[day] || {count: 0, reviews: 0, newIds: [], completedIds: []};
        const newIds = [...new Set([...(existing.newIds || []), ...(activity.newIds || [])])];
        const completedIds = [...new Set([...(existing.completedIds || []), ...(activity.completedIds || [])])];
        result.activity[day] = {
          count: completedIds.length || Math.max(existing.count || 0, activity.count || 0),
          reviews: Math.max(existing.reviews || 0, activity.reviews || 0),
          newIds,
          completedIds
        };
      }
    }
    return result;
  }

  async function loadRemoteState(session) {
    const rows = await api(`/rest/v1/user_progress?user_id=eq.${encodeURIComponent(session.user.id)}&select=state,updated_at&limit=1`, {method: 'GET'}, session.access_token);
    return rows?.[0]?.state || null;
  }

  async function pushRemoteState(nextState) {
    const session = await ensureFreshSession();
    const body = {
      user_id: session.user.id,
      username: session.username,
      state: nextState,
      updated_at: new Date().toISOString()
    };
    await api('/rest/v1/user_progress?on_conflict=user_id', {
      method: 'POST',
      headers: {Prefer: 'resolution=merge-duplicates,return=minimal'},
      body: JSON.stringify(body)
    }, session.access_token);
    $('#syncStatus').textContent = '学习记录已同步';
  }

  async function activateAccount(session, includeGuestProgress) {
    storeSession(session);
    const cached = window.MeowApp.readStateForScope(session.user.id);
    const remote = await loadRemoteState(session);
    const guest = includeGuestProgress ? window.MeowApp.readStateForScope('guest') : null;
    const merged = mergeStates(guest, cached, remote);
    window.MeowApp.activateStorageScope(session.user.id, merged);
    updateAccountUI();
    await pushRemoteState(merged);
  }

  function friendlyError(error) {
    const message = String(error?.message || error);
    if (/invalid login credentials/i.test(message)) return '用户名或密码不正确';
    if (/already registered|already been registered|duplicate/i.test(message)) return '这个用户名已经被注册';
    if (/password.*least/i.test(message)) return '密码强度不足，请至少输入 8 位';
    if (/failed to fetch|network/i.test(message)) return '网络连接失败，请稍后重试';
    return message;
  }

  async function submitAuth(event) {
    event.preventDefault();
    const username = $('#authUsername').value.trim().normalize('NFKC');
    const password = $('#authPassword').value;
    const confirmation = $('#authPasswordConfirm').value;
    const validationError = validateCredentials(username, password, confirmation);
    if (validationError) { $('#authError').textContent = validationError; return; }

    const button = $('#authSubmitBtn');
    button.disabled = true;
    button.textContent = mode === 'register' ? '正在创建…' : '正在登录…';
    $('#authError').textContent = '';
    try {
      const email = await usernameToEmail(username);
      const path = mode === 'register' ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password';
      const body = mode === 'register' ? {email, password, data: {username}} : {email, password};
      const payload = await api(path, {method: 'POST', body: JSON.stringify(body)});
      if (!payload?.access_token || !payload?.user) throw new Error('请在 Supabase 中关闭 Confirm email 后再注册用户名账号');
      const session = normalizeSession(payload, username);
      await activateAccount(session, mode === 'register');
      $('#authPassword').value = '';
      $('#authPasswordConfirm').value = '';
      window.showToast?.(mode === 'register' ? '账号创建成功，游客进度已同步' : '登录成功，欢迎回来');
    } catch (error) {
      $('#authError').textContent = friendlyError(error);
    } finally {
      button.disabled = false;
      button.textContent = mode === 'register' ? '创建账号并同步' : '登录';
    }
  }

  async function restoreSession() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { saved = null; }
    if (!saved?.refresh_token || !saved?.user?.id) return;
    currentSession = saved;
    try {
      const session = await ensureFreshSession();
      await activateAccount(session, false);
    } catch {
      localStorage.removeItem(SESSION_KEY);
      currentSession = null;
      window.MeowApp.activateStorageScope('guest');
      updateAccountUI();
    }
  }

  async function logout() {
    const session = currentSession;
    currentSession = null;
    localStorage.removeItem(SESSION_KEY);
    window.MeowApp.activateStorageScope('guest');
    updateAccountUI();
    $('#authDialog').close();
    window.showToast?.('已退出，当前为游客模式');
    if (session?.access_token) {
      try { await api('/auth/v1/logout', {method: 'POST'}, session.access_token); } catch { /* 本地退出仍然有效 */ }
    }
  }

  function scheduleSync(event) {
    if (!currentSession || event.detail?.scope !== currentSession.user.id) return;
    clearTimeout(syncTimer);
    $('#syncStatus').textContent = navigator.onLine ? '正在同步…' : '当前离线，将在联网后同步';
    syncTimer = setTimeout(async () => {
      if (!navigator.onLine) return;
      try { await pushRemoteState(event.detail.state); }
      catch { $('#syncStatus').textContent = '同步失败，将稍后重试'; }
    }, 800);
  }

  function bindEvents() {
    $('#authButton').addEventListener('click', openDialog);
    $('#authCloseBtn').addEventListener('click', () => $('#authDialog').close());
    $('#continueGuestBtn').addEventListener('click', () => $('#authDialog').close());
    $('#authForm').addEventListener('submit', submitAuth);
    $('#logoutBtn').addEventListener('click', logout);
    document.querySelectorAll('[data-auth-mode]').forEach(button => button.addEventListener('click', () => setAuthMode(button.dataset.authMode)));
    window.addEventListener('meow:state-saved', scheduleSync);
    window.addEventListener('online', () => {
      if (currentSession) pushRemoteState(window.MeowApp.getState()).catch(() => { $('#syncStatus').textContent = '同步失败，将稍后重试'; });
    });
  }

  bindEvents();
  updateAccountUI();
  if (isConfigured) restoreSession();
  window.MeowAuth = {isConfigured, openDialog};
})();
