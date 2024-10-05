import React, { useState } from 'react';

const ContactHR = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Here you can add the logic to handle form submission, e.g., sending to an API
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-6 lg:p-8 bg-base-200 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-primary">Contact HR</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Message</span>
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Submit
        </button>
        {isSubmitted && (
          <p className="mt-4 text-sm text-green-500">Your message has been sent successfully.</p>
        )}
      </form>
    </div>
  );
};

export default ContactHR;
