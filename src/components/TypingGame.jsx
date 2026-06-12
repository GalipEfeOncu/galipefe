import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

/* ── Word pools ─────────────────────────────────────────────── */
const WORDS_EN = [
    'the', 'be', 'to', 'of', 'and', 'that', 'have', 'with',
    'from', 'they', 'say', 'her', 'she', 'will', 'one', 'all',
    'would', 'there', 'their', 'what', 'out', 'about', 'who',
    'get', 'which', 'when', 'make', 'can', 'like', 'time', 'just',
    'know', 'take', 'into', 'year', 'your', 'good', 'some', 'could',
    'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only',
    'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
    'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
    'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most',
    'code', 'build', 'run', 'fast', 'clean', 'flow', 'type', 'word',
    'key', 'mind', 'write', 'read', 'push', 'pull', 'link', 'page',
    'data', 'test', 'open', 'free', 'play', 'next', 'last', 'long',
];

const WORDS_TR = [
    'bir', 'bu', 'ile', 'için', 'olan', 'var', 'ben', 'sen',
    'biz', 'onlar', 'ama', 'çok', 'daha', 'gibi', 'kadar', 'her',
    'de', 'da', 'ne', 'ki', 'ya', 'yok', 'ise', 'hem', 'en',
    'tam', 'hiç', 'artık', 'hep', 'böyle', 'şey', 'zaman', 'iyi',
    'yeni', 'büyük', 'küçük', 'güzel', 'hızlı', 'açık', 'bilgi',
    'yaz', 'oku', 'bak', 'git', 'gel', 'ver', 'al', 'yap',
    'gün', 'yıl', 'ay', 'saat', 'yer', 'kez', 'tür', 'yan',
    'kod', 'test', 'sayfa', 'veri', 'oyun', 'hız', 'tip', 'söz',
    'his', 'ses', 'göz', 'el', 'ad', 'iş', 'yol', 'son',
    'hem', 'tam', 'çalış', 'üret', 'düşün', 'geç', 'dur', 'uç',
];

/* ── Personal Records ────────────────────────────────────────── */
const PERSONAL_RECORD = 155; // MonkeyType 15s record

/* ── Score comments ─────────────────────────────────────────── */
function getComment(wpm, lang, myWpm) {
    const ratio = wpm / myWpm;

    if (lang === 'tr') {
        if (wpm >= myWpm) return `${wpm} WPM — Beni geçtin! Tebrikler, bu kaçıncı denemen?`;
        if (ratio >= 0.85) return `${wpm} WPM — Çok yaklaştın! Rekoruma az kaldı.`;
        if (ratio >= 0.65) return `${wpm} WPM — Fena sayılmaz, ama benim rekoruma daha var.`;
        if (ratio >= 0.45) return `${wpm} WPM — İdare eder. Biraz daha pratik?`;
        return `${wpm} WPM — Klavye biraz ısınması lazım galiba.`;
    }
    if (wpm >= myWpm) return `${wpm} WPM — You beat me! Impressive, was this your first try?`;
    if (ratio >= 0.85) return `${wpm} WPM — So close to my record!`;
    if (ratio >= 0.65) return `${wpm} WPM — Not bad! Still a ways off my record though.`;
    if (ratio >= 0.45) return `${wpm} WPM — Decent. Might want to practice more.`;
    return `${wpm} WPM — The keyboard needs warming up.`;
}

/* ── Generate a word line ────────────────────────────────────── */
function generateWords(pool, count = 60) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const arr = [];
    while (arr.length < count) arr.push(...shuffled);
    return arr.slice(0, count);
}

/* ── Main Component ──────────────────────────────────────────── */
const DURATION = 10; // seconds

export default function TypingGame() {
    const { lang } = useLanguage();
    const pool = lang === 'tr' ? WORDS_TR : WORDS_EN;
    const myRecord = PERSONAL_RECORD;

    // Session-level played flag lives in module scope so F5 resets it
    const [phase, setPhase] = useState('idle'); // idle | playing | done
    const [words, setWords] = useState(() => generateWords(pool));
    const [typed, setTyped] = useState('');
    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(DURATION);
    const [hasPlayed, setHasPlayed] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [wordStatuses, setWordStatuses] = useState([]); // 'correct' | 'wrong' | ''
    const [timerStarted, setTimerStarted] = useState(false);

    const inputRef = useRef(null);
    const timerRef = useRef(null);
    const wordsContainerRef = useRef(null);
    const activeWordRef = useRef(null);

    /* Re-generate words when lang changes (only if not played yet) */
    useEffect(() => {
        if (phase === 'idle') {
            setWords(generateWords(lang === 'tr' ? WORDS_TR : WORDS_EN));
        }
    }, [lang, phase]);

    /* Timer logic - starts only when timerStarted is true */
    useEffect(() => {
        if (phase !== 'playing' || !timerStarted) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    finishGame();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, timerStarted]);

    /* Scroll active word into view */
    useEffect(() => {
        activeWordRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, [currentWordIdx]);

    const finishGame = useCallback(() => {
        clearInterval(timerRef.current);
        setPhase(prev => {
            if (prev === 'done') return prev; // guard double-call
            return 'done';
        });
        setHasPlayed(true);
    }, []);

    /* Calculate WPM when transitioning to done using standard character formula */
    useEffect(() => {
        if (phase === 'done') {
            let correctChars = 0;

            // 1. Fully typed correct words (word length + 1 space)
            wordStatuses.forEach((status, idx) => {
                if (status === 'correct') {
                    correctChars += words[idx].length + 1;
                }
            });

            // 2. Active word correct characters
            const currentWord = words[currentWordIdx];
            if (currentWord && typed.length > 0) {
                const typedClean = typed.trim();
                let matches = 0;
                for (let i = 0; i < Math.min(typedClean.length, currentWord.length); i++) {
                    if (typedClean[i] === currentWord[i]) {
                        matches++;
                    } else {
                        break;
                    }
                }
                correctChars += matches;
            }

            // Standard WPM: (correctChars / 5) / (seconds_elapsed / 60)
            // With fixed 10 seconds: (correctChars / 5) / (10 / 60) = correctChars * 1.2
            const calculatedWpm = Math.round((correctChars / 5) / (DURATION / 60));
            setWpm(calculatedWpm);
        }
    }, [phase, wordStatuses, words, currentWordIdx, typed]);

    const startGame = () => {
        if (hasPlayed) return;
        setPhase('playing');
        setTimerStarted(false);
        setTyped('');
        setCurrentWordIdx(0);
        setTimeLeft(DURATION);
        setWordStatuses([]);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleInput = (e) => {
        if (phase !== 'playing') return;
        const val = e.target.value;

        // Start timer on first character typed
        if (!timerStarted && val.length > 0) {
            setTimerStarted(true);
        }

        // Space = confirm word
        if (val.endsWith(' ')) {
            const typedWord = val.trim();
            const expected = words[currentWordIdx];
            const isCorrect = typedWord === expected;

            setWordStatuses(prev => {
                const next = [...prev];
                next[currentWordIdx] = isCorrect ? 'correct' : 'wrong';
                return next;
            });
            setCurrentWordIdx(i => i + 1);
            setTyped('');
            return;
        }
        setTyped(val);
    };

    /* Highlight logic for current word */
    const currentExpected = words[currentWordIdx] || '';
    const typedClean = typed.trim();
    const isCurrentWrong = typedClean.length > 0 && !currentExpected.startsWith(typedClean);

    /* Timer ring progress */
    const ringPct = timeLeft / DURATION;
    const circumference = 2 * Math.PI * 16; // r=16
    const dashOffset = circumference * (1 - ringPct);

    const urgentTimer = timeLeft <= 3;

    return (
        <div className="tg-shell">
            {/* Header row */}
            <div className="tg-header">
                <span className="tg-label">mini game</span>
                <div className="tg-record-badge">
                    <span className="tg-record-key">my record</span>
                    <span className="tg-record-val">{myRecord} wpm</span>
                </div>
            </div>

            {/* Idle state */}
            {phase === 'idle' && !hasPlayed && (
                <div className="tg-idle">
                    <p className="tg-idle-desc">
                        {lang === 'tr'
                            ? '10 saniye, rastgele kelimeler — ne kadar hızlı yazabilirsin?'
                            : '10 seconds, random words — how fast can you type?'}
                    </p>
                    <button className="tg-start-btn" onClick={startGame}>
                        {lang === 'tr' ? 'Başla' : 'Start'}
                        <span className="tg-start-icon">↵</span>
                    </button>
                </div>
            )}

            {/* Playing state */}
            {phase === 'playing' && (
                <>
                    {/* Timer */}
                    <div className={`tg-timer-row${urgentTimer ? ' urgent' : ''}`}>
                        <svg className="tg-ring" viewBox="0 0 36 36" width="36" height="36">
                            <circle cx="18" cy="18" r="16" fill="none" strokeWidth="2.5" className="tg-ring-bg" />
                            <circle
                                cx="18" cy="18" r="16" fill="none" strokeWidth="2.5"
                                className="tg-ring-progress"
                                strokeDasharray={circumference}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="round"
                                transform="rotate(-90 18 18)"
                            />
                            <text x="18" y="22" textAnchor="middle" className="tg-ring-text">{timeLeft}</text>
                        </svg>
                    </div>

                    {/* Words display */}
                    <div className="tg-words-container" ref={wordsContainerRef}>
                        {words.map((word, idx) => {
                            const status = wordStatuses[idx];
                            let cls = 'tg-word';
                            if (status === 'correct') cls += ' correct';
                            else if (status === 'wrong') cls += ' wrong';
                            else if (idx === currentWordIdx) {
                                cls += ' active';
                                if (isCurrentWrong) cls += ' active-wrong';
                            } else if (idx < currentWordIdx) {
                                cls += ' done';
                            }

                            return (
                                <span
                                    key={idx}
                                    className={cls}
                                    ref={idx === currentWordIdx ? activeWordRef : null}
                                >
                                    {word}
                                </span>
                            );
                        })}
                    </div>

                    {/* Input */}
                    <input
                        ref={inputRef}
                        className={`tg-input${isCurrentWrong ? ' input-wrong' : ''}`}
                        value={typed}
                        onChange={handleInput}
                        placeholder={lang === 'tr' ? 'yazmaya başla...' : 'start typing...'}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                    />
                </>
            )}

            {/* Done state */}
            {phase === 'done' && (
                <div className="tg-result">
                    <div className="tg-result-wpm">
                        <span className="tg-result-number">{wpm}</span>
                        <span className="tg-result-unit">wpm</span>
                    </div>
                    <p className="tg-result-comment">{getComment(wpm, lang, myRecord)}</p>
                    <div className="tg-result-compare">
                        <div className="tg-compare-item">
                            <span className="tg-compare-label">{lang === 'tr' ? 'senin' : 'you'}</span>
                            <div className="tg-compare-bar-wrap">
                                <div
                                    className="tg-compare-bar you"
                                    style={{ width: `${Math.min(100, (wpm / (myRecord * 1.2)) * 100)}%` }}
                                />
                            </div>
                            <span className="tg-compare-val">{wpm}</span>
                        </div>
                        <div className="tg-compare-item">
                            <span className="tg-compare-label">{lang === 'tr' ? 'benim' : 'me'}</span>
                            <div className="tg-compare-bar-wrap">
                                <div
                                    className="tg-compare-bar me"
                                    style={{ width: `${Math.min(100, (myRecord / (myRecord * 1.2)) * 100)}%` }}
                                />
                            </div>
                            <span className="tg-compare-val">{myRecord}</span>
                        </div>
                    </div>
                    <p className="tg-once-note">
                        {lang === 'tr' ? 'F5 ile tekrar oynayabilirsin.' : 'Refresh to play again.'}
                    </p>
                </div>
            )}
        </div>
    );
}
