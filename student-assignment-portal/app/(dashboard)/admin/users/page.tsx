'use client';

import { useState, useEffect } from 'react';
import { UserDto } from '@/lib/types';
import { api } from '@/lib/api-client';
import { mockAdminUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

interface DisplayUser {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  status: string;
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.get<UserDto[]>('/api/admin/users');
        setUsers(data.map(u => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          role: u.role.toLowerCase(),
          joinDate: new Date(u.createdAt).toLocaleDateString(),
          status: u.isVerified ? 'active' : 'pending',
        })));
      } catch {
        setUsers(mockAdminUsers);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'teacher':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddUser = () => {
    addToast('Add user form would open in a full application', 'info');
  };

  const handleEditUser = (userId: string, userName: string) => {
    addToast(`Editing user: ${userName}`, 'info');
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      await api.delete(`/api/admin/teachers/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      addToast(`User "${userName}" has been deleted`, 'success');
    } catch {
      addToast('Failed to delete user. You can only delete teachers.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 sm:h-8 w-6 sm:w-8" />
            User Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Manage all users on the platform.
          </p>
        </div>
        <Button
          onClick={handleAddUser}
          className="bg-primary hover:bg-primary/90 whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>{filteredUsers.length} total users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-2 sm:px-4 py-3 text-left font-semibold text-foreground">Name</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left font-semibold text-foreground">Email</th>
                  <th className="px-2 sm:px-4 py-3 text-left font-semibold text-foreground">Role</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left font-semibold text-foreground">Join Date</th>
                  <th className="px-2 sm:px-4 py-3 text-left font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border hover:bg-secondary/50">
                    <td className="px-2 sm:px-4 py-3 text-foreground font-medium truncate">{u.name}</td>
                    <td className="hidden sm:table-cell px-4 py-3 text-muted-foreground truncate">{u.email}</td>
                    <td className="px-2 sm:px-4 py-3">
                      <Badge className={getRoleColor(u.role)}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-muted-foreground">{u.joinDate}</td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleEditUser(u.id, u.name)}
                          className="p-1 hover:bg-secondary rounded transition"
                          title="Edit user"
                        >
                          <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1 hover:bg-secondary rounded transition"
                          title="Delete user"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
