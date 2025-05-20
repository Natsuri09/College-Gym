"use client";
import { useEffect, useState } from 'react';

export default function ManageMembersPage() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(setMembers);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this member?')) return;
    await fetch(`/api/members/${id}`, { method: 'DELETE' });
    setMembers(members => members.filter(m => m.id !== id));
  };

  return (
    <div className="container py-5">
      <h2>Manage Members</h2>
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Username</th><th>Role</th><th>Action</th></tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.username}</td>
              <td>{m.role}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 