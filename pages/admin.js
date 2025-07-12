import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import Head from "next/head";

export default function Admin() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ question: "", options: ["", "", "", ""], answer: "" });

  // Fetch existing questions
  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  // Handle form input changes
  const updateForm = (index, value, isOption = false) => {
    if (isOption) {
      const updatedOptions = [...form.options];
      updatedOptions[index] = value;
      setForm({ ...form, options: updatedOptions });
    } else {
      setForm({ ...form, [index]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newQ = await res.json();
    setQuestions([...questions, newQ]);
    setForm({ question: "", options: ["", "", "", ""], answer: "" });
  };

  const handleDelete = async (id) => {
    await fetch(`/api/questions/${id}`, { method: "DELETE" });
    setQuestions(questions.filter((q) => q._id !== id));
  };

  return (
    <>
      <Head>
        <title>Admin Panel | Quiz App</title>
        <meta name="description" content="Manage quiz questions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white flex flex-col text-gray-800">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
          <h1 className="text-2xl font-bold text-blue-700">📋 Admin Panel</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            🚪 Logout
          </button>
        </header>

        {/* Main */}
        <main className="flex-grow px-4 py-8 md:px-12">
          {/* Add Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-xl p-6 mb-10 max-w-3xl mx-auto"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Question</h2>

            <input
              type="text"
              placeholder="Question"
              value={form.question}
              onChange={(e) => updateForm("question", e.target.value)}
              required
              className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {form.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => updateForm(i, e.target.value, true)}
                required
                className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            ))}

            <input
              type="text"
              placeholder="Correct Answer"
              value={form.answer}
              onChange={(e) => updateForm("answer", e.target.value)}
              required
              className="w-full mb-5 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              ➕ Add Question
            </button>
          </form>

          {/* Questions List */}
          <section className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 Existing Questions</h2>
            <ul className="space-y-6">
              {questions.map((q) => (
                <li key={q._id} className="bg-white rounded-xl p-5 shadow-md border">
                  <div className="mb-2">
                    <strong className="block text-lg text-blue-800">{q.question}</strong>
                  </div>
                  <ul className="list-disc ml-5 text-gray-700 mb-2">
                    {q.options.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-green-700">
                    <strong>Answer:</strong> {q.answer}
                  </p>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="text-red-600 hover:text-red-800 text-sm mt-2"
                  >
                    🗑 Delete
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center py-4 bg-white border-t text-sm text-gray-600">
          All rights reserved © VRG @2025
        </footer>
      </div>
    </>
  );
}

// Auth protection
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
