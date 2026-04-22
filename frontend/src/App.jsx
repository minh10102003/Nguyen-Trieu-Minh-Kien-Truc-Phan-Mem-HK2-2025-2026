import { useCallback, useEffect, useMemo, useState } from 'react';
import * as api from './api';

const SHOWTIMES = ['10:00', '13:20', '16:40', '19:30', '22:15'];
const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
/** Left block 1–6, aisle gap, right block 7–12 (giống layout rạp thường gặp) */
const SEAT_LEFT = [1, 2, 3, 4, 5, 6];
const SEAT_RIGHT = [7, 8, 9, 10, 11, 12];

function useSession() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const persist = useCallback((t, u) => {
    setToken(t);
    setUser(u);
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
    if (u) localStorage.setItem('user', JSON.stringify(u));
    else localStorage.removeItem('user');
  }, []);

  const logout = useCallback(() => persist('', null), [persist]);

  return { token, user, persist, logout };
}

function posterStyle(id) {
  const hues = [350, 200, 280, 25, 145];
  const h = hues[Number(id) % hues.length];
  return {
    background: `linear-gradient(145deg, hsl(${h} 65% 22%) 0%, hsl(${h} 45% 8%) 50%, #0a0a0a 100%)`,
  };
}

function statusLabel(s) {
  if (s === 'PAID') return { text: 'Đã thanh toán', className: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30' };
  if (s === 'FAILED') return { text: 'Thất bại', className: 'bg-red-500/15 text-red-300 ring-red-500/30' };
  return { text: 'Đang xử lý', className: 'bg-amber-500/15 text-amber-200 ring-amber-500/25' };
}

export default function App() {
  const { token, user, persist, logout } = useSession();
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [regUser, setRegUser] = useState({ username: '', password: '' });
  const [loginUser, setLoginUser] = useState({ username: '', password: '' });

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showtime, setShowtime] = useState(SHOWTIMES[2]);
  const [selectedSeat, setSelectedSeat] = useState('');

  const loadMovies = useCallback(async () => {
    setError('');
    try {
      const m = await api.fetchMovies();
      setMovies(Array.isArray(m) ? m : []);
    } catch (e) {
      setError(e.message || 'Không tải được danh sách phim');
    }
  }, []);

  const loadBookings = useCallback(async () => {
    if (!token) return;
    setError('');
    try {
      const b = await api.fetchBookings(token);
      setBookings(Array.isArray(b) ? b : []);
    } catch (e) {
      setError(e.message || 'Không tải được vé');
    }
  }, [token]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  useEffect(() => {
    if (token) loadBookings();
  }, [token, loadBookings]);

  useEffect(() => {
    if (!token) return;
    const id = setInterval(() => loadBookings(), 2500);
    return () => clearInterval(id);
  }, [token, loadBookings]);

  const latest = useMemo(() => bookings[0], [bookings]);
  const selectedMovieTitle = useMemo(
    () => movies.find((m) => m.id === selectedMovie?.id)?.title,
    [movies, selectedMovie]
  );

  const onRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await api.register(regUser.username, regUser.password);
      setMessage('Đăng ký thành công. Bạn có thể đăng nhập.');
      setRegUser({ username: '', password: '' });
      setAuthTab('login');
    } catch (err) {
      setError(err.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const data = await api.login(loginUser.username, loginUser.password);
      persist(data.token, { userId: data.userId, username: data.username });
      setMessage('Đăng nhập thành công.');
      setLoginUser({ username: '', password: '' });
      setAuthOpen(false);
    } catch (err) {
      setError(err.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onBook = async () => {
    if (!token) {
      setAuthOpen(true);
      setError('Vui lòng đăng nhập để đặt vé.');
      return;
    }
    if (!selectedMovie) {
      setError('Chọn phim trước.');
      return;
    }
    if (!selectedSeat) {
      setError('Chọn một ghế trên sơ đồ.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await api.createBooking(token, selectedMovie.id, selectedSeat);
      setMessage('Đã tạo đơn. Hệ thống đang xác nhận thanh toán…');
      setSelectedSeat('');
      await loadBookings();
    } catch (err) {
      setError(err.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const pickMovie = (m) => {
    setSelectedMovie({ id: m.id, title: m.title, posterUrl: m.posterUrl });
    setSelectedSeat('');
    setMessage('');
    setError('');
    requestAnimationFrame(() => {
      document.getElementById('booking-zone')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const toggleSeat = (code) => {
    setSelectedSeat((prev) => (prev === code ? '' : code));
  };

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100">
      {/* Top utility bar — kiểu thanh phụ CGV */}
      <div className="border-b border-white/10 bg-neutral-900 text-xs text-neutral-300">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
          <span>Hà Nội</span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Hỗ trợ: 1900-xxxx</span>
            <span className="font-medium text-amber-400">Thành viên</span>
          </div>
        </div>
      </div>

      {/* Header chính */}
      <header className="sticky top-0 z-40 border-b-4 border-cgv-red bg-neutral-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#" className="group flex items-center gap-3" onClick={(e) => e.preventDefault()}>
            <div className="flex h-11 w-11 items-center justify-center rounded bg-cgv-red font-display text-2xl tracking-tight text-white shadow-lg shadow-cgv-red/30 transition group-hover:bg-cgv-red-dark">
              M
            </div>
            <div>
              <p className="font-display text-2xl leading-none tracking-wide text-white">MOVIE</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-neutral-400">Đặt vé online</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-wide text-neutral-300 md:flex">
            <span className="cursor-default text-white">Phim</span>
            <span className="cursor-default text-neutral-200 hover:text-white">Rạp</span>
            <span className="cursor-default text-neutral-200 hover:text-white">Khuyến mãi</span>
            <button
              type="button"
              onClick={() => document.getElementById('tickets-zone')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-neutral-200 hover:text-white"
            >
              Vé của tôi
            </button>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden max-w-[140px] truncate text-sm text-neutral-300 sm:inline">
                  Xin chào, <span className="font-semibold text-white">{user.username}</span>
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded border border-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-300 hover:border-red-500 hover:text-white"
                >
                  Thoát
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthOpen(true);
                  setAuthTab('login');
                }}
                className="rounded bg-cgv-red px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-cgv-red-dark"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-red-950/80 via-neutral-950 to-neutral-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(229,9,20,0.35),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
          <p className="font-display text-4xl text-white md:text-6xl">Phim đang chiếu</p>
          <p className="mt-2 max-w-xl text-sm text-neutral-300 md:text-base md:leading-relaxed">
            Chọn phim, suất chiếu (giao diện mẫu) và ghế — hệ thống gửi đặt vé qua API như demo EDA.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        {error ? (
          <div className="rounded border border-red-400/60 bg-red-950/90 px-4 py-3 text-sm font-medium text-red-50 shadow-lg shadow-red-950/50">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="rounded border border-emerald-400/50 bg-emerald-950/90 px-4 py-3 text-sm font-medium text-emerald-50">
            {message}
          </div>
        ) : null}

        {/* Lưới phim — poster dọc giống CGV */}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl tracking-wide text-white">Chọn phim</h2>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Now showing</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.map((m) => (
              <article
                key={m.id}
                className="group overflow-hidden rounded-lg border border-white/15 bg-zinc-900 shadow-xl transition hover:border-red-500/60 hover:shadow-red-950/30"
              >
                <div
                  className="relative aspect-[2/3] overflow-hidden bg-neutral-900"
                  style={m.posterUrl ? undefined : posterStyle(m.id)}
                >
                  {m.posterUrl ? (
                    <img
                      src={m.posterUrl}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {m.subtitle ? (
                      <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-300">{m.subtitle}</p>
                    ) : null}
                    <h3 className="font-display text-2xl leading-tight text-white drop-shadow-md">{m.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-200/95">
                      {m.tagline || m.description || 'Đang cập nhật nội dung.'}
                    </p>
                  </div>
                  <span className="absolute right-3 top-3 rounded bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white ring-1 ring-white/20">
                    {m.ageRating || 'K'}
                  </span>
                  {m.promotion ? (
                    <div className="absolute left-3 top-3 max-w-[calc(100%-4rem)] rounded bg-emerald-600/95 px-2 py-1 text-[10px] font-bold leading-tight text-white shadow-lg">
                      {Number(m.promotion.promoPrice).toLocaleString('vi-VN')} {m.promotion.currency}
                      <span className="block font-normal opacity-90">{m.promotion.marketingTagline || m.promotion.label}</span>
                    </div>
                  ) : null}
                </div>
                <div className="flex gap-2 border-t border-white/5 p-3">
                  <button
                    type="button"
                    onClick={() => pickMovie(m)}
                    className="flex-1 rounded bg-cgv-red py-2.5 text-center text-sm font-bold uppercase tracking-wide text-white hover:bg-cgv-red-dark"
                  >
                    Mua vé
                  </button>
                </div>
              </article>
            ))}
          </div>
          {movies.length === 0 ? (
            <p className="py-12 text-center text-base font-medium text-neutral-300">
              Chưa có phim. Khởi động movie-service để tải dữ liệu.
            </p>
          ) : null}
        </section>

        {/* Khu đặt vé: suất + sơ đồ ghế */}
        <section
          id="booking-zone"
          className="scroll-mt-28 rounded-xl border border-white/15 bg-zinc-900/95 p-6 shadow-inner shadow-black/40 md:p-8"
        >
          <div className="mb-6 flex flex-col gap-2 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-3xl text-white">Chọn suất &amp; ghế</h2>
              {selectedMovie ? (
                <p className="mt-1 text-sm text-neutral-300">
                  Phim: <span className="font-semibold text-white">{selectedMovieTitle || selectedMovie.title}</span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-neutral-300">Chọn phim ở trên để tiếp tục.</p>
              )}
            </div>
            {selectedMovie ? (
              <div className="flex flex-wrap gap-2">
                {SHOWTIMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setShowtime(t)}
                    className={`min-w-[4.5rem] rounded border px-3 py-2 text-sm font-semibold transition ${
                      showtime === t
                        ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-900/40'
                        : 'border-white/20 bg-zinc-950 text-neutral-200 hover:border-white/40'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {!selectedMovie ? (
            <div className="rounded-lg border border-dashed border-white/25 bg-zinc-950 py-16 text-center text-base text-neutral-200">
              Nhấn <span className="font-bold text-red-500">Mua vé</span> trên poster phim để mở sơ đồ ghế.
            </div>
          ) : (
            <>
              <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                Suất {showtime} · 2D · Phụ đề
              </p>

              {/* Màn hình */}
              <div className="mx-auto mb-10 max-w-3xl">
                <div className="cgv-screen-curve mx-auto h-3 w-[88%] bg-gradient-to-b from-neutral-700 to-neutral-900" />
                <div className="cgv-screen-curve -mt-1 mx-auto flex h-14 w-[92%] items-center justify-center bg-gradient-to-b from-neutral-800/90 to-black text-xs font-semibold uppercase tracking-[0.35em] text-neutral-300 shadow-screen">
                  Màn hình
                </div>
              </div>

              {/* Chú thích */}
              <div className="mb-6 flex flex-wrap justify-center gap-6 text-xs font-medium text-neutral-300">
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-white/30 bg-neutral-800" /> Thường
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-amber-400/60 bg-amber-500/25" /> VIP
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border-2 border-red-500 bg-red-600/40" /> Ghế bạn chọn
                </span>
              </div>

              {/* Sơ đồ ghế */}
              <div className="mx-auto max-w-4xl space-y-2">
                {SEAT_ROWS.map((row, ri) => {
                  const isVip = ri >= SEAT_ROWS.length - 3;
                  return (
                    <div key={row} className="flex items-center justify-center gap-2 sm:gap-3">
                      <span className="w-5 text-right text-xs font-bold text-neutral-400">{row}</span>
                      <div className="flex gap-1 sm:gap-1.5">
                        {SEAT_LEFT.map((n) => {
                          const code = `${row}${n}`;
                          const sel = selectedSeat === code;
                          return (
                            <button
                              key={code}
                              type="button"
                              disabled={!selectedMovie}
                              onClick={() => toggleSeat(code)}
                              className={`flex h-8 w-8 items-center justify-center rounded text-[10px] font-bold transition sm:h-9 sm:w-9 ${
                                isVip
                                  ? 'border border-amber-500/50 bg-amber-500/15 text-amber-100'
                                  : 'border border-white/15 bg-neutral-800 text-neutral-100'
                              } ${sel ? 'border-2 border-red-500 bg-red-600/50 text-white ring-2 ring-red-400/60' : 'hover:border-red-500/70'}`}
                              aria-label={`Ghế ${code}`}
                            >
                              {n}
                            </button>
                          );
                        })}
                      </div>
                      <div className="w-4 sm:w-8" aria-hidden />
                      <div className="flex gap-1 sm:gap-1.5">
                        {SEAT_RIGHT.map((n) => {
                          const code = `${row}${n}`;
                          const sel = selectedSeat === code;
                          return (
                            <button
                              key={code}
                              type="button"
                              disabled={!selectedMovie}
                              onClick={() => toggleSeat(code)}
                              className={`flex h-8 w-8 items-center justify-center rounded text-[10px] font-bold transition sm:h-9 sm:w-9 ${
                                isVip
                                  ? 'border border-amber-500/50 bg-amber-500/15 text-amber-100'
                                  : 'border border-white/15 bg-neutral-800 text-neutral-100'
                              } ${sel ? 'border-2 border-red-500 bg-red-600/50 text-white ring-2 ring-red-400/60' : 'hover:border-red-500/70'}`}
                              aria-label={`Ghế ${code}`}
                            >
                              {n}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
                <div className="text-center text-sm sm:text-left">
                  <p className="font-medium text-neutral-400">Ghế đã chọn</p>
                  <p className="font-display text-3xl text-white">{selectedSeat || '—'}</p>
                </div>
                <button
                  type="button"
                  disabled={loading || !selectedSeat}
                  onClick={onBook}
                  className="w-full min-w-[200px] rounded bg-cgv-red px-8 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-cgv-red-dark disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  {loading ? 'Đang gửi…' : 'Thanh toán'}
                </button>
              </div>
              {!token ? (
                <p className="mt-4 text-center text-sm font-medium text-amber-300">Đăng nhập để hoàn tất đặt vé.</p>
              ) : null}
            </>
          )}
        </section>

        {/* Vé đã đặt — dạng thẻ */}
        {token ? (
          <section id="tickets-zone" className="scroll-mt-28">
            <h2 className="mb-6 font-display text-3xl text-white">Vé của tôi</h2>
            {latest ? (
              <div className="mb-8 overflow-hidden rounded-lg border border-white/15 bg-gradient-to-r from-zinc-900 to-black md:flex">
                <div className="flex flex-1 flex-col justify-center gap-2 p-6 md:p-8">
                  <p className="text-xs uppercase tracking-widest text-cgv-red">Gần nhất</p>
                  <p className="font-display text-4xl text-white">#{latest.id}</p>
                  <p className="text-sm text-neutral-300">
                    Phim #{latest.movieId} · Ghế {latest.seat} · Suất (demo) {showtime}
                  </p>
                  <span
                    className={`mt-2 inline-flex w-fit rounded px-3 py-1 text-xs font-bold uppercase ring-1 ${statusLabel(latest.status).className}`}
                  >
                    {statusLabel(latest.status).text}
                  </span>
                </div>
                <div className="hidden w-px bg-gradient-to-b from-transparent via-white/20 to-transparent md:block" />
                <div className="relative flex items-center justify-center border-t border-dashed border-white/20 bg-black/40 p-6 md:border-t-0 md:w-48">
                  <div className="rotate-0 text-center text-[10px] font-medium uppercase tracking-widest text-neutral-400 md:-rotate-90">
                    E-Ticket
                  </div>
                </div>
              </div>
            ) : null}
            <ul className="space-y-3">
              {bookings.map((b) => {
                const st = statusLabel(b.status);
                return (
                  <li
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/15 bg-zinc-900/90 px-4 py-3"
                  >
                    <div>
                      <span className="font-mono text-xs text-neutral-400">#{b.id}</span>
                      <p className="text-sm text-white">
                        Phim <span className="font-semibold">#{b.movieId}</span> · Ghế{' '}
                        <span className="font-semibold text-red-500">{b.seat}</span>
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${st.className}`}>{st.text}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}
      </main>

      <footer className="mt-16 border-t border-white/10 bg-neutral-950 py-10 text-center text-sm text-neutral-400">
        <p className="font-display text-lg tracking-widest text-neutral-400">MOVIE</p>
        <p className="mt-2 max-w-lg mx-auto px-4 leading-relaxed">
          Giao diện tham khảo phong cách đặt vé rạp phổ biến tại Việt Nam. Dự án demo — không liên kết thương mại.
        </p>
      </footer>

      {/* Modal đăng nhập / đăng ký */}
      {authOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-title"
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/15 bg-zinc-900 shadow-2xl">
            <button
              type="button"
              onClick={() => setAuthOpen(false)}
              className="absolute right-3 top-3 rounded p-1 text-2xl leading-none text-neutral-400 hover:text-white"
              aria-label="Đóng"
            >
              ×
            </button>
            <div className="border-b border-white/10 bg-black/40 px-6 pt-8">
              <p id="auth-title" className="font-display text-3xl text-white">
                Thành viên
              </p>
              <div className="mt-4 flex gap-0">
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`flex-1 border-b-2 py-3 text-sm font-bold uppercase ${
                    authTab === 'login' ? 'border-cgv-red text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  className={`flex-1 border-b-2 py-3 text-sm font-bold uppercase ${
                    authTab === 'register' ? 'border-cgv-red text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Đăng ký
                </button>
              </div>
            </div>
            <div className="p-6">
              {authTab === 'login' ? (
                <form onSubmit={onLogin} className="space-y-4">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-300">
                    Tài khoản
                    <input
                      className="mt-1.5 w-full rounded border border-white/20 bg-black/60 px-3 py-2.5 text-neutral-50 outline-none focus:border-red-500"
                      value={loginUser.username}
                      onChange={(e) => setLoginUser((s) => ({ ...s, username: e.target.value }))}
                      autoComplete="username"
                    />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-300">
                    Mật khẩu
                    <input
                      type="password"
                      className="mt-1.5 w-full rounded border border-white/20 bg-black/60 px-3 py-2.5 text-neutral-50 outline-none focus:border-red-500"
                      value={loginUser.password}
                      onChange={(e) => setLoginUser((s) => ({ ...s, password: e.target.value }))}
                      autoComplete="current-password"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-cgv-red py-3 text-sm font-bold uppercase text-white hover:bg-cgv-red-dark disabled:opacity-50"
                  >
                    Đăng nhập
                  </button>
                </form>
              ) : (
                <form onSubmit={onRegister} className="space-y-4">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-300">
                    Tài khoản
                    <input
                      className="mt-1.5 w-full rounded border border-white/20 bg-black/60 px-3 py-2.5 text-neutral-50 outline-none focus:border-red-500"
                      value={regUser.username}
                      onChange={(e) => setRegUser((s) => ({ ...s, username: e.target.value }))}
                      autoComplete="username"
                    />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-300">
                    Mật khẩu
                    <input
                      type="password"
                      className="mt-1.5 w-full rounded border border-white/20 bg-black/60 px-3 py-2.5 text-neutral-50 outline-none focus:border-red-500"
                      value={regUser.password}
                      onChange={(e) => setRegUser((s) => ({ ...s, password: e.target.value }))}
                      autoComplete="new-password"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded border border-white/20 py-3 text-sm font-bold uppercase text-white hover:bg-white/5 disabled:opacity-50"
                  >
                    Đăng ký
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
