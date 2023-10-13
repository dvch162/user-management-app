import './App.css'
import React, { useEffect } from 'react';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useLocalObservable } from 'mobx-react-lite';
import { v4 as uuidv4 } from 'uuid';


import { UserStore, IUserStore } from './UserStore'; 


const App = () => {
  
  const userStore = useLocalObservable<IUserStore>(() => UserStore.create({ users: [] }));



  useEffect(() => {
    console.log('Component is mounting or re-rendering.');
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        console.log('Data fetched successfully:', response.data); 

        const userList = response.data;
        userList.forEach(user => {
          userStore.addUser(user.id, user.name.toString(), user.username);

        });
      })
      .catch(error => {
        console.error('Помилка завантаження даних:', error);
      });
}, []);
console.log('Component re-render'); // Log re-renders


  const handleAddUser = () => {
    const newUser = {
      id: Date.now().toString(),
      name: 'New User',
      username: 'newuser',
    };
    userStore.addUser(parseInt(newUser.id, 10), newUser.name, newUser.username);
  };

  const handleRemoveUser = user => {
    if (!user.isBlocked) {
      userStore.removeUser(user);
    }
  };

  return (
    <div>
      <h2>Список користувачів</h2>
      <ul>
        {userStore.users.map((user) => (
          // <li key={user.id}>
          <li key={uuidv4()}>
 {user.isBlocked ? (
  <div>
    <strong>{user.name}</strong> ({user.username})
    <button onClick={() => user.toggleBlock()}>Blocked</button>
  </div>
) :  user.isEditing ? (
            <div>
              <input
                type="text"
                value={user.editedName}
                // onChange={(e) => userStore.updateName(user, e.target.value)}
                onChange={(e) => user.setName(e.target.value)}
              />
              {/* <button onClick={() => userStore.updateName(user, user.name)}>Save</button> */}
              <button onClick={() => userStore.updateName(user)}>Save</button>
            </div>
          ) : (
            <div>
              <strong>{user.name}</strong> ({user.username})
              <button onClick={() => userStore.toggleEdit(user)}>Редагувати</button>
              <button onClick={() => handleRemoveUser(user)}>Видалити</button>
              <button onClick={() => user.toggleBlock()}>
      {user.isBlocked ? 'Unblock' : 'Block'}
    </button>
            </div>
          )}
        </li>
      ))}
    </ul>
    <button onClick={handleAddUser}>Додати користувача</button>
  </div>
);
};

export default observer(App);
