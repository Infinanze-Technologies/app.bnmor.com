import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useStore = create(set => ({
  students: [
    { id: '1', name: 'Aaron Saunders', section: 'advanced' },
    { id: '2', name: 'Andrea Saunders', section: 'beginners' },
    { id: '3', name: 'Bill Smith', section: 'beginners' },
    { id: '4', name: 'John Chambers', section: 'beginners' },
    { id: '5', name: 'Joe Johnson', section: 'advanced' }
  ],
  addStudent: (student) =>
    set(state => ({
      students: [
        {
          name: student.name,
          id: Math.random() * 100 + '',
          section: student.section
        },
        ...state.students
      ]
    })),
  removeStudent: id =>
    set(state => ({
      students: state.students.filter(student => student.id !== id)
    })),
  updateStudent: student =>
    set(state => ({
      students: state.students.map(item => {
        if (item.id === student.id) {
          return {
            ...item,
            name: student.name,
            section: student.section
          };
        } else {
          return item;
        }
      })
    }))
}));

export const useStudentStore = useStore;
