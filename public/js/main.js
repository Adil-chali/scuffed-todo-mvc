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
    el.addEventListener('click', toggleComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', toggleComplete)
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

async function toggleComplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/toggleComplete', {
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
let hideTimeoutId = null;

function setStatus(element, statusClass, message) {

  element.classList.remove('loading', 'done-image', 'failed-image', 'hidden');

  element.classList.add(statusClass);
  element.textContent = message;
  
  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  

  if (statusClass !== 'loading') {
    hideTimeoutId = setTimeout(() => {
      element.classList.add('hidden');
      hideTimeoutId = null;
    }, 10000);
  }
}

function uploadingImg() {
  setStatus(uploadStatusDiv, 'loading', 'Uploading image...');
}

function imgUploaded() {
  setStatus(uploadStatusDiv, 'done-image', 'Image uploaded! ✓');
}

function failedImageUpload() {
  setStatus(uploadStatusDiv, 'failed-image', 'Upload failed. Todo will be saved without image.');
}

//big thanks to https://github.com/FrantaBOT

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  uploadingImg()

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
          
      uploadedImageUrl =data.link
      deleteImageUrl =`https://femboy.beauty/api/delete?key=${data.key}`
      
      imgUploaded()
      
      return {uploadedImageUrl,deleteImageUrl}
    } catch (err) {
      console.error('Upload failed:', err);
      failedImageUpload() 
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
    formData.append('deleteImageUrl', deleteImageUrl);
  }

  try {
    const response = await fetch('/todos/createTodo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    });
    location.reload()

  } catch (err) {
    console.error('Todo creation failed:', err);
    alert('Failed to create todo');
    submitBtn.disabled = false;
    loadingDiv.style.display = 'none';
  }
});
