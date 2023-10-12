import { types, flow } from 'mobx-state-tree';


const User = types.model('User', {
  id: types.number,
  name: types.string,
  username: types.string,
  // Додайте інші поля користувача за потребою
  isBlocked: types.optional(types.boolean, false),
});

const UserStore = types
  .model('UserStore', {
    users: types.array(User),
  })
  addActions((self) => ({
    // Додавання користувача
    addUser(userData: typeof User) {
      self.users.push(userData);
    },
    // Редагування імені користувача
    editUserName(userId: number, newName: string) {
      const user = self.users.find((u) => u.id === userId);
      if (user) {
        user.name = newName;
      }
    },
    // Видалення користувача
    deleteUser(userId: number) {
      const index = self.users.findIndex((u) => u.id === userId);
      if (index !== -1) {
        self.users.splice(index, 1);
      }
    },
    // Блокування або розблокування користувача
    toggleBlockUser(userId: number) {
      const user = self.users.find((u) => u.id === userId);
      if (user) {
        user.isBlocked = !user.isBlocked;
      }
    },
  }))
  .actions((self) => ({
    // Асинхронний завантаження користувачів з API
    loadUsers: flow(function* () {
      try {
        const response = yield fetch('https://jsonplaceholder.typicode.com/users');
        const users = yield response.json();
        self.users = users;
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
      }
    }),
  }));

export default UserStore;
