// import  { useState, useEffect } from 'react';
// import { observer } from 'mobx-react-lite';
// import { getSnapshot } from 'mobx-state-tree';
// import UserStore from './UserStore';


import './App.css'
import  { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { types, flow, Instance } from 'mobx-state-tree';

interface UserData {
  id: number;
  name: string;
  username: string;
  isBlocked: boolean;
}

const User = types
  .model('User', {
    id: types.identifierNumber,
    name: types.string,
    username: types.string,
    isBlocked: types.optional(types.boolean, false),
  })
  .actions(self => ({
    editUserName(newName: string) {
      self.name = newName;
    },
    toggleBlockUser() {
      self.isBlocked = !self.isBlocked;
    },
  }));

const UserStore = types
  .model('UserStore', {
    users: types.array(User),
  })
  .actions(self => ({
    addUser(user: Instance<typeof User>) {
      self.users.push(user);
    },
    deleteUser(userId: number) {
      const index = self.users.findIndex(user => user.id === userId);
      if (index !== -1) {
        self.users.splice(index, 1);
      }
    },
  }))
  .actions(self => ({
    loadUsers: flow(function* () {
      try {
        const response = yield fetch('https://jsonplaceholder.typicode.com/users');
        const users: UserData[] = yield response.json();

        users.forEach(userData => {
          const newUser = User.create(userData);
          self.addUser(newUser);
        });
      } catch (error) {
        console.error('Error loading users:', error);
      }
    }),
  }));

const App = observer(() => {
  const userStore = UserStore.create({ users: [] });

  useEffect(() => {
    userStore.loadUsers();
  }, [userStore]);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {userStore.users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> ({user.username})
            <button onClick={() => user.editUserName('New Name')}>Edit</button>
            <button onClick={() => userStore.deleteUser(user.id)}>Delete</button>
            <button onClick={() => user.toggleBlockUser()}>
              {user.isBlocked ? 'Unblock' : 'Block'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default App;
