const list = document.querySelector('ul');
const form = document.querySelector('form');
const unsubButton = document.querySelector('.btn-secondary')




const addRecipe = (recipes,id) => {

 const time = recipes.created_at.toDate()
  const html = `
   <li data-id="${id}">${recipes.title}
   <div>${time}</div>
   <button type="button" class="btn btn-danger my-2">Delete</button>
   </li>
  `

  list.innerHTML += html;
}

const deletelistItem = (id) => {
  const allList = document.querySelectorAll('li')
   allList.forEach(list => {
     if(list.getAttribute('data-id') === id){
       list.remove()
     }
   })

}


const unsub = db.collection('recipes').onSnapshot(snapshot => {
  // console.log(snapShot.docChanges())
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
   if(change.type === 'added'){
      addRecipe(doc.data(), doc.id)
   }else if(change.type === 'removed'){
      deletelistItem(doc.id)
   }
  })
})

/*
db.collection('recipes').get().then((snapshot) => {
  console.log(snapshot.docs[0])
  snapshot.docs.forEach(doc => {
  
    addRecipe(doc.data(), doc.id);
  
  })
}).catch(err => console.log(err.message));
*/


form.addEventListener('submit',event => {
  event.preventDefault();
  const now = new Date();
  const recipe = {
    title: form.recipe.value,
    created_at: firebase.firestore.Timestamp.fromDate(now)
  }


 db.collection('recipes').add(recipe).then(() => {
    console.log('collection has been added')
  }).catch(err => console.log(err,'there is error'));

});



list.addEventListener('click',event => {
  // console.log(event.target.tagName);
  if(event.target.tagName === 'BUTTON'){
    
    const listId = event.target.parentElement.getAttribute('data-id')
    db.collection('recipes').doc(listId).delete().then(() => console.log('you item has been deleted successfully')).catch(err => console.log(err))
  }

})

unsubButton.addEventListener('click', () => {
  unsub()
})

