import React from 'react';

const ImportantUpdates = () => {
  const updates = [
    { id: 1, title: 'New Policy on Remote Work', date: '2024-10-01', description: 'The remote work policy has been updated. Please review the new guidelines.' },
    { id: 2, title: 'Upcoming Team Building Event', date: '2024-10-15', description: 'Join us for a team building event at the park. RSVP by next week.' },
    { id: 3, title: 'Mandatory Training Session', date: '2024-10-20', description: 'A mandatory training session will be held on Oct 20th. Please mark your calendars.' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Important Updates</h1>
      <div className="grid grid-cols-1 gap-4">
        {updates.map(update => (
          <div key={update.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{update.title}</h2>
              <p className="text-gray-500">{update.date}</p>
              <p>{update.description}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Read More</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImportantUpdates;
