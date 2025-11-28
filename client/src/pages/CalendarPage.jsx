import { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEventsStore } from '../stores/eventsStore';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input, { Textarea } from '../components/Input';
import { getWeekNumber } from '../lib/utils';
import { isHoliday } from '../lib/holidays';

export default function CalendarPage() {
  const { events, fetchEvents, createEvent, updateEvent, deleteEvent } = useEventsStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'week' or 'month'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    allDay: false,
    color: '#3b82f6',
  });

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const getWeekDays = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    const monday = new Date(date.setDate(diff));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      days.push(current);
    }
    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setFormData({
      ...formData,
      startDate: date.toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createEvent({
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
    });
    setIsModalOpen(false);
    resetForm();
    fetchEvents();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      allDay: false,
      color: '#3b82f6',
    });
    setSelectedDate(null);
  };

  const monthDays = getDaysInMonth(currentDate);
  const weekDays = getWeekDays(new Date(currentDate));
  const weekNumber = getWeekNumber(currentDate);

  // Get week numbers for each week in the month view
  const getWeekNumbersForMonth = () => {
    const weeks = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      weeks.push(getWeekNumber(monthDays[i].date));
    }
    return weeks;
  };

  const weekNumbers = getWeekNumbersForMonth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded-lg text-sm ${
                view === 'week'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded-lg text-sm ${
                view === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Month
            </button>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Event
        </Button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handlePrevious} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            {view === 'week' && (
              <p className="text-sm text-gray-500">Week {weekNumber}</p>
            )}
          </div>
          <button onClick={handleNext} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <ChevronRight size={20} />
          </button>
        </div>

        {view === 'month' ? (
          <>
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="text-center text-sm font-medium text-gray-500">Week</div>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-8 gap-2">
              {weekNumbers.map((weekNum, weekIdx) => (
                <div key={`week-${weekIdx}`} className="contents">
                  <div className="flex items-center justify-center text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {weekNum}
                  </div>
                  {monthDays.slice(weekIdx * 7, (weekIdx + 1) * 7).map((day, idx) => {
                    const dayEvents = getEventsForDate(day.date);
                    const holiday = isHoliday(day.date);
                    const isToday = 
                      day.date.getDate() === new Date().getDate() &&
                      day.date.getMonth() === new Date().getMonth() &&
                      day.date.getFullYear() === new Date().getFullYear();
                    
                    return (
                      <button
                        key={`${weekIdx}-${idx}`}
                        onClick={() => handleDateClick(day.date)}
                        className={`min-h-[80px] p-2 rounded-lg border transition-colors text-left ${
                          day.isCurrentMonth
                            ? holiday
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                              : isToday
                              ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 hover:bg-primary-100 dark:hover:bg-primary-900/30'
                              : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'
                        }`}
                      >
                        <div className={`text-sm font-medium mb-1 ${holiday ? 'text-red-600 dark:text-red-400' : ''}`}>
                          {day.day}
                        </div>
                        {holiday && (
                          <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1 truncate" title={holiday.name}>
                            {holiday.nameEn}
                          </div>
                        )}
                        <div className="space-y-1">
                          {dayEvents.slice(0, holiday ? 1 : 2).map((event) => (
                            <div
                              key={event.id}
                              className="text-xs p-1 rounded truncate"
                              style={{ backgroundColor: event.color + '20', color: event.color }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > (holiday ? 1 : 2) && (
                            <div className="text-xs text-gray-500">+{dayEvents.length - (holiday ? 1 : 2)} more</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Week {weekNumber}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {weekDays.map((day) => {
                const dayEvents = getEventsForDate(day);
                const holiday = isHoliday(day);
                const isToday = 
                  day.getDate() === new Date().getDate() &&
                  day.getMonth() === new Date().getMonth() &&
                  day.getFullYear() === new Date().getFullYear();
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={`w-full p-4 rounded-lg border transition-colors text-left ${
                      holiday
                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                        : isToday
                        ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">
                          {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className={`text-2xl font-bold ${holiday ? 'text-red-600 dark:text-red-400' : ''}`}>
                          {day.getDate()}
                        </div>
                        {holiday && (
                          <div className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
                            {holiday.nameEn}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        {holiday && (
                          <div className="p-2 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                            <div className="font-medium text-sm">{holiday.name}</div>
                          </div>
                        )}
                        {dayEvents.length === 0 && !holiday ? (
                          <p className="text-gray-400 text-sm">No events</p>
                        ) : (
                          dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className="p-2 rounded"
                              style={{ backgroundColor: event.color + '20', color: event.color }}
                            >
                              <div className="font-medium">{event.title}</div>
                              {event.description && (
                                <div className="text-sm opacity-80">{event.description}</div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="New Event"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <Input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.allDay}
                onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
              />
              <span className="text-sm">All day event</span>
            </label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Create Event
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
