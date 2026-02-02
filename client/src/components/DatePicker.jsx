import { useState } from 'react';

const DatePicker = ({ onDateSelect, selectedDate }) => {
    const [offset, setOffset] = useState(0);

    // Generate next 7 days
    const getDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i + offset);
            dates.push(date);
        }

        return dates;
    };

    const dates = getDates();

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        return { day, month, dayName, fullDate: date.toDateString() };
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px', // Reduced gap
            width: '100%',
            overflow: 'hidden',
            padding: '10px 0'
        }}>
            {offset > 0 && (
                <button
                    onClick={() => setOffset(offset - 7)}
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    ←
                </button>
            )}

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, justifyContent: 'flex-start', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {dates.map((date, idx) => {
                    const { day, month, dayName, fullDate } = formatDate(date);
                    const isActive = selectedDate === fullDate;

                    return (
                        <div
                            key={idx}
                            onClick={() => onDateSelect(fullDate)}
                            style={{
                                background: isActive ? 'linear-gradient(135deg, var(--primary-color) 0%, #ff4b5c 100%)' : 'rgba(255,255,255,0.05)',
                                padding: '8px 16px',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                minWidth: '60px',
                                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: isActive ? '0 8px 20px rgba(229, 9, 20, 0.4)' : 'none',
                                userSelect: 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.transform = 'none';
                                }
                            }}
                        >
                            <div style={{ fontSize: '0.7rem', color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {dayName}
                            </div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', lineHeight: '1.2' }}>
                                {day}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }}>
                                {month}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={() => setOffset(offset + 7)}
                style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                →
            </button>
        </div>
    );
};

export default DatePicker;
