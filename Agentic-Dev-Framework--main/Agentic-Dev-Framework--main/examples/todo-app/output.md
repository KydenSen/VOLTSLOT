# Final Output: Mark Complete Feature

*(The resulting code patches applied by the Coder agent during Stage 5)*

### `models/todo.js` (Diff)
```javascript
 const mongoose = require('mongoose');

 const todoSchema = new mongoose.Schema({
   title: { type: String, required: true },
+  is_completed: { type: Boolean, default: false },
   created_at: { type: Date, default: Date.now }
 });

 module.exports = mongoose.model('Todo', todoSchema);
```

### `routes/todo_routes.js` (Diff)
```javascript
const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// ... existing GET and POST routes ...

+ // Toggle completion status
+ router.patch('/:id/toggle', async (req, res) => {
+   try {
+     const todo = await Todo.findById(req.params.id);
+     if (!todo) return res.status(404).json({ message: 'Todo not found' });
+     
+     todo.is_completed = !todo.is_completed;
+     await todo.save();
+     
+     res.json(todo);
+   } catch (err) {
+     res.status(500).json({ message: err.message });
+   }
+ });

module.exports = router;
```

### `views/index.html` (Diff)
```html
 <!-- In the Todo list rendering loop -->
 <li class="todo-item" data-id="<%= todo._id %>">
+  <input type="checkbox" class="toggle-complete" <%= todo.is_completed ? 'checked' : '' %>>
-  <span><%= todo.title %></span>
+  <span class="todo-text <%= todo.is_completed ? 'strikethrough' : '' %>"><%= todo.title %></span>
 </li>

 <!-- In the script block -->
 <script>
+ document.querySelectorAll('.toggle-complete').forEach(checkbox => {
+   checkbox.addEventListener('change', async (e) => {
+     const li = e.target.closest('.todo-item');
+     const id = li.dataset.id;
+     
+     const response = await fetch(`/todo/${id}/toggle`, { method: 'PATCH' });
+     if (response.ok) {
+       const updated = await response.json();
+       const textSpan = li.querySelector('.todo-text');
+       if (updated.is_completed) {
+         textSpan.classList.add('strikethrough');
+       } else {
+         textSpan.classList.remove('strikethrough');
+       }
+     }
+   });
+ });
 </script>
```
