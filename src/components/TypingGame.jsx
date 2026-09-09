import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const WORDS_EN = ['the', 'be', 'to', 'of', 'and', 'that', 'have', 'with', 'from', 'they', 'say', 'her', 'she', 'will', 'one', 'all', 'would', 'there', 'their', 'what', 'out', 'about', 'who', 'get', 'which', 'when', 'make', 'can', 'like', 'time', 'just', 'know', 'take', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'code', 'build', 'run', 'fast', 'clean', 'flow', 'type', 'word', 'key', 'mind', 'write', 'read', 'push', 'pull', 'link', 'page', 'data', 'test', 'open', 'free', 'play', 'next', 'last', 'long'];
const WORDS_TR = ['bir', 'bu', 'ile', 'için', 'olan', 'var', 'ben', 'sen', 'biz', 'onlar', 'ama', 'çok', 'daha', 'gibi', 'kadar', 'her', 'de', 'da', 'ne', 'ki', 'ya', 'yok', 'ise', 'hem', 'en', 'tam', 'hiç', 'artık', 'hep', 'böyle', 'şey', 'zaman', 'iyi', 'yeni', 'büyük', 'küçük', 'güzel', 'hızlı', 'açık', 'bilgi', 'yaz', 'oku', 'bak', 'git', 'gel', 'ver', 'al', 'yap', 'gün', 'yıl', 'ay', 'saat', 'yer', 'kez', 'tür', 'yan', 'kod', 'test', 'sayfa', 'veri', 'oyun', 'hız', 'tip', 'söz', 'his', 'ses', 'göz', 'el', 'ad', 'iş', 'yol', 'son', 'çalış', 'üret', 'düşün', 'geç', 'dur', 'uç'];
const PERSONAL_RECORDS = { 15: 160, 30: 143, 60: 129 };
const DURATIONS = [15, 30, 60];

function generateWords(pool, count = 180) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const words = [];
    while (words.length < count) words.push(...shuffled);
    return words.slice(0, count);
}

function getComment(wpm, record, t) {
    const ratio = wpm / record;
    const key = wpm >= record ? 'beat' : ratio >= 0.85 ? 'near' : ratio >= 0.65 ? 'good' : ratio >= 0.45 ? 'decent' : 'warmup';
    return t(`typingGame.result.${key}`).replace('{wpm}', wpm);
}

function calculateWpm(words, wordStatuses, currentWordIdx, typed, duration) {
    const correctChars = wordStatuses.reduce((total, status, index) => status === 'correct' ? total + words[index].length + 1 : total, 0);
    const currentWord = words[currentWordIdx] || '';
    const currentTyped = typed.trim();
    const mismatch = [...currentTyped].findIndex((character, index) => character !== currentWord[index]);
    const activeCorrectChars = mismatch === -1 ? currentTyped.length : mismatch;
    return Math.round(((correctChars + activeCorrectChars) / 5) / (duration / 60));
}

export default function TypingGame() {
    const { lang, t } = useLanguage();
    const pool = lang === 'tr' ? WORDS_TR : WORDS_EN;
    const [duration, setDuration] = useState(30);
    const [phase, setPhase] = useState('ready');
    const [words, setWords] = useState(() => generateWords(pool));
    const [typed, setTyped] = useState('');
    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [wordStatuses, setWordStatuses] = useState([]);
    const [timerStarted, setTimerStarted] = useState(false);
    const inputRef = useRef(null);
    const restartButtonRef = useRef(null);
    const quickRestartButtonRef = useRef(null);
    const timerRef = useRef(null);
    const activeWordRef = useRef(null);

    const finishGame = useCallback(() => {
        clearInterval(timerRef.current);
        inputRef.current?.blur();
        setPhase((currentPhase) => currentPhase === 'done' ? currentPhase : 'done');
    }, []);

    useEffect(() => {
        if (phase !== 'playing' || !timerStarted) return undefined;
        timerRef.current = setInterval(() => {
            setTimeLeft((currentTime) => {
                if (currentTime <= 1) {
                    clearInterval(timerRef.current);
                    finishGame();
                    return 0;
                }
                return currentTime - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [finishGame, phase, timerStarted]);

    useEffect(() => {
        activeWordRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, [currentWordIdx]);

    useEffect(() => {
        if (phase !== 'done') return undefined;
        const focusTimer = window.setTimeout(() => restartButtonRef.current?.focus(), 50);
        return () => window.clearTimeout(focusTimer);
    }, [phase]);

    useEffect(() => {
        if (phase === 'done') return undefined;
        const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
        return () => window.clearTimeout(focusTimer);
    }, [duration, phase]);

    const resetGame = useCallback((nextDuration = duration) => {
        clearInterval(timerRef.current);
        setWords(generateWords(pool));
        setTyped('');
        setCurrentWordIdx(0);
        setTimeLeft(nextDuration);
        setWordStatuses([]);
        setTimerStarted(false);
        setPhase('ready');
    }, [duration, pool]);

    const startGame = () => {
        resetGame();
        window.setTimeout(() => inputRef.current?.focus(), 50);
    };

    const changeDuration = (nextDuration) => {
        setDuration(nextDuration);
        resetGame(nextDuration);
        window.setTimeout(() => inputRef.current?.focus(), 50);
    };

    const currentExpected = words[currentWordIdx] || '';
    const typedClean = typed.trim();
    const isCurrentWrong = typedClean.length > 0 && !currentExpected.startsWith(typedClean);
    const circumference = 2 * Math.PI * 16;
    const dashOffset = circumference * (1 - (timeLeft / duration));
    const wpm = phase === 'done' ? calculateWpm(words, wordStatuses, currentWordIdx, typed, duration) : 0;
    const personalRecord = PERSONAL_RECORDS[duration];

    const handleRestartKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            startGame();
        } else if (event.key === ' ') {
            event.preventDefault();
        }
    };

    const handleInputKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            quickRestartButtonRef.current?.focus();
        }
    };

    const handleInput = (event) => {
        if (phase === 'done') return;
        const value = event.target.value;
        if (!timerStarted && value.length > 0) {
            setTimerStarted(true);
            setPhase('playing');
        }
        if (value.endsWith(' ')) {
            const isCorrect = value.trim() === words[currentWordIdx];
            setWordStatuses((statuses) => {
                const nextStatuses = [...statuses];
                nextStatuses[currentWordIdx] = isCorrect ? 'correct' : 'wrong';
                return nextStatuses;
            });
            setCurrentWordIdx((index) => index + 1);
            setTyped('');
            return;
        }
        setTyped(value);
    };

    return (
        <section className="tg-shell" aria-label={t('typingGame.label')}>
            <div className="tg-header">
                <div className="tg-title-group">
                    <h1 className="tg-label">{t('typingGame.label')}</h1>
                    <div className="tg-record-badge"><span className="tg-record-key">{t('typingGame.record')}</span><span className="tg-record-val">{personalRecord} wpm</span></div>
                </div>
                <div className="tg-header-controls">
                    <div className="tg-duration-control" aria-label={t('typingGame.durationLabel')}>
                        <span>{t('typingGame.durationLabel')}</span>
                        <div className="tg-duration-options">
                            {DURATIONS.map((option) => <button key={option} type="button" className={duration === option ? 'active' : ''} aria-pressed={duration === option} onClick={() => changeDuration(option)}>{t('typingGame.durationOption').replace('{seconds}', option)}</button>)}
                        </div>
                    </div>
                    <button ref={quickRestartButtonRef} type="button" className="tg-quick-restart" onClick={startGame} onKeyDown={handleRestartKeyDown} aria-label={t('typingGame.restart')}>↻</button>
                </div>
            </div>
            {phase !== 'done' && <div className="tg-test-area">
                <div className={`tg-timer-row${timeLeft <= 3 ? ' urgent' : ''}`} role="timer" aria-label={t('typingGame.timeLeft').replace('{seconds}', timeLeft)}>
                    <svg className="tg-ring" viewBox="0 0 36 36" width="36" height="36" aria-hidden="true"><circle cx="18" cy="18" r="16" fill="none" strokeWidth="2.5" className="tg-ring-bg" /><circle cx="18" cy="18" r="16" fill="none" strokeWidth="2.5" className="tg-ring-progress" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" transform="rotate(-90 18 18)" /><text x="18" y="22" textAnchor="middle" className="tg-ring-text">{timeLeft}</text></svg>
                </div>
                <div className="tg-words-container">
                    {words.map((word, index) => {
                        const status = wordStatuses[index];
                        const className = status === 'correct' ? 'tg-word correct' : status === 'wrong' ? 'tg-word wrong' : index === currentWordIdx ? `tg-word active${isCurrentWrong ? ' active-wrong' : ''}` : index < currentWordIdx ? 'tg-word done' : 'tg-word';
                        return <span key={`${word}-${index}`} className={className} ref={index === currentWordIdx ? activeWordRef : null}>{word}</span>;
                    })}
                </div>
                <input ref={inputRef} className={`tg-input${isCurrentWrong ? ' input-wrong' : ''}`} value={typed} onChange={handleInput} onKeyDown={handleInputKeyDown} placeholder={t('typingGame.inputPlaceholder')} aria-label={t('typingGame.inputLabel')} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
            </div>}
            {phase === 'done' && <div className="tg-result" aria-live="polite">
                <div className="tg-result-wpm"><span className="tg-result-number">{wpm}</span><span className="tg-result-unit">wpm</span></div>
                <p className="tg-result-comment">{getComment(wpm, personalRecord, t)}</p>
                <div className="tg-result-compare">
                    <div className="tg-compare-item"><span className="tg-compare-label">{t('typingGame.you')}</span><div className="tg-compare-bar-wrap"><div className="tg-compare-bar you" style={{ width: `${Math.min(100, (wpm / (personalRecord * 1.2)) * 100)}%` }} /></div><span className="tg-compare-val">{wpm}</span></div>
                    <div className="tg-compare-item"><span className="tg-compare-label">{t('typingGame.me')}</span><div className="tg-compare-bar-wrap"><div className="tg-compare-bar me" style={{ width: `${Math.min(100, (personalRecord / (personalRecord * 1.2)) * 100)}%` }} /></div><span className="tg-compare-val">{personalRecord}</span></div>
                </div>
                <button ref={restartButtonRef} className="tg-start-btn tg-restart-btn" type="button" onClick={startGame} onKeyDown={handleRestartKeyDown}>{t('typingGame.restart')}</button>
                <p className="tg-once-note">{t('typingGame.restartHint')}</p>
            </div>}
        </section>
    );
}
