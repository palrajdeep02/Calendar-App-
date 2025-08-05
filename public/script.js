let calendar = null;
let allEvents = [];
const notifiedTwoDayEvents = new Set();

// 🔔 Ask for notification permission
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

// 🔔 Show a notification
function showNotification(event) {
  if (Notification.permission === 'granted') {
    new Notification(event.title || "📢 Event Alert", {
      body: `${event.type} on ${event.date} at ${event.time}`,
      icon: '/icon.png' // Optional icon
    });
  }
}

// 🔔 Notify if event is exactly 2 days away
setInterval(() => {
  const now = new Date();
  const target = new Date();
  target.setDate(now.getDate() + 2);
  target.setHours(0, 0, 0, 0);

  allEvents.forEach(event => {
    const eventDate = new Date(`${event.date}T${event.time}`);
    eventDate.setHours(0, 0, 0, 0);
    const key = `${event.id}-2days`;

    if (eventDate.getTime() === target.getTime() && !notifiedTwoDayEvents.has(key)) {
      showNotification({
        ...event,
        title: `📆 2 Days Left: ${event.title}`
      });
      notifiedTwoDayEvents.add(key);
    }
  });
}, 60000);

// 🧠 Filter events by type
function filterEvents(events) {
  const selected = document.getElementById('filter-type').value;
  return selected === 'All' ? events : events.filter(e => e.type === selected);
}

// 🗓 Render FullCalendar
function renderCalendar(events) {
  const calendarEl = document.getElementById('calendar');
  const filtered = filterEvents(events);
  if (calendar) calendar.destroy();

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: filtered.map(e => ({
      id: String(e.id),
      title: e.title,
      start: `${e.date}T${e.time}`,
      extendedProps: { ...e }
    })),
    eventClick: function (info) {
      const modal = document.getElementById('event-modal');
      modal.style.display = 'block';

      document.getElementById('edit-id').value = info.event.id;
      document.getElementById('edit-title').value = info.event.title;
      document.getElementById('edit-date').value = info.event.startStr.split('T')[0];
      document.getElementById('edit-time').value = info.event.startStr.split('T')[1]?.slice(0, 5);
      document.getElementById('edit-type').value = info.event.extendedProps.type;
      document.getElementById('edit-description').value = info.event.extendedProps.description || '';
    }
  });

  calendar.render();
}

// 🔄 Load all events
function loadEvents() {
  fetch('/api/events')
    .then(res => res.json())
    .then(events => {
      allEvents = events;
      renderCalendar(events);
      updateUpcoming(events);
    });
}

// ➕ Add new event
document.getElementById('event-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const newEvent = {
    title: document.getElementById('title').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    type: document.getElementById('type').value,
    description: document.getElementById('description').value
  };

  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newEvent)
  })
    .then(res => res.json())
    .then(event => {
      document.getElementById('event-form').reset();
      showNotification(event);
      loadEvents();
    });
});

// ✏️ Save changes to event
document.getElementById('edit-event-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const updated = {
    title: document.getElementById('edit-title').value,
    date: document.getElementById('edit-date').value,
    time: document.getElementById('edit-time').value,
    type: document.getElementById('edit-type').value,
    description: document.getElementById('edit-description').value
  };

  updateEvent(id, updated);
  closeModal();
});

// 🗑 Delete event
document.getElementById('delete-btn').addEventListener('click', () => {
  const id = document.getElementById('edit-id').value;
  if (confirm('Are you sure you want to delete this event?')) {
    deleteEvent(id);
    closeModal();
  }
});

// 🔄 Refresh on filter
document.getElementById('filter-type').addEventListener('change', () => {
  renderCalendar(allEvents);
  updateUpcoming(allEvents);
});

// 📆 Upcoming 2-week list
function updateUpcoming(events) {
  const now = new Date();
  const twoWeeks = new Date();
  twoWeeks.setDate(now.getDate() + 14);
  const selected = document.getElementById('filter-type').value;

  const list = document.getElementById('upcoming-events');
  const upcoming = events.filter(e => {
    const date = new Date(`${e.date}T${e.time}`);
    const match = selected === 'All' || e.type === selected;
    return date >= now && date <= twoWeeks && match;
  });

  list.innerHTML = '';
  if (upcoming.length === 0) {
    list.innerHTML = '<li>No upcoming events in the next 2 weeks.</li>';
    return;
  }

  upcoming.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
    .forEach(event => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${event.title}</strong> (${event.type})<br>${event.date} at ${event.time}`;
      list.appendChild(li);
    });
}

// 🔧 Helpers
function closeModal() {
  document.getElementById('event-modal').style.display = 'none';
}
document.querySelector('.close').onclick = closeModal;

function deleteEvent(id) {
  fetch(`/api/events/${id}`, { method: 'DELETE' })
    .then(() => loadEvents());
}
function updateEvent(id, data) {
  fetch(`/api/events/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(() => loadEvents());
}

// 🚀 Init
loadEvents();
