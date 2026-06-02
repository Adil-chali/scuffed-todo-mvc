const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('span.not')
const todoComplete = document.querySelectorAll('span.completed')
const form = document.getElementById('todoForm');
const fileInput = document.getElementById('fileElem');
const todoInput = document.getElementById('todoItem');
const submitBtn = document.getElementById('submitBtn');
const loadingDiv = document.getElementById('loading');
const uploadStatusDiv = document.getElementById('uploadStatus');

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

async function deleteTodo(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}


fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  uploadStatusDiv.style.display = 'block';
  uploadStatusDiv.textContent = 'Uploading image...';
  uploadStatusDiv.style.color = 'orange';
  
  uploadPromise = (async () => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('https://femboy.beauty/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();  
      console.log(data);
          
      let = uploadedImageUrl =data.link
      let = deleteImageUrl =`https://femboy.beauty/api/delete?key=${data.key}`
      
      uploadStatusDiv.textContent = 'Image uploaded! ✓';
      uploadStatusDiv.style.color = 'green';
      
      setTimeout(() => {
        uploadStatusDiv.style.display = 'none';
      }, 10000);
      
      return {uploadedImageUrl,deleteImageUrl}
    } catch (err) {
      console.error('Upload failed:', err);
      uploadStatusDiv.textContent = 'Upload failed. Todo will be saved without image.';
      uploadStatusDiv.style.color = 'red';
      uploadedImageUrl = null;
      return null;
    }
  })();
});


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const todoText = todoInput.value.trim();

  submitBtn.disabled = true;
  loadingDiv.style.display = 'block';
  
  let imageUrl = null;
  let deleteImageUrl = null;
  
 
  if (uploadPromise) {
    const result = await uploadPromise;
    imageUrl = result.uploadedImageUrl;
    deleteImageUrl = result.deleteImageUrl;
  }
  
  
  const formData = new URLSearchParams();
  formData.append('todoItem', todoText);
  if (imageUrl) {
    formData.append('pictureUrl', imageUrl);
  }
  if (deleteImageUrl) {
    formData.append('deleteImageUrl', deleteImageUrl);
  }
  
  try {
    const response = await fetch('/todos/createTodo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    if (response.redirected) {
      window.location.href = response.url;
    } else {
      window.location.href = '/todos';
    }
  } catch (err) {
    console.error('Todo creation failed:', err);
    alert('Failed to create todo');
    submitBtn.disabled = false;
    loadingDiv.style.display = 'none';
  }
});
