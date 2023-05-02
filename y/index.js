// Firestore stuff
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, query } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyDZFmGewFYpK6aDnfjVltwK8bHE5x6___o",
    authDomain: "digitalstewardship.firebaseapp.com",
    projectId: "digitalstewardship",
    storageBucket: "digitalstewardship.appspot.com",
    messagingSenderId: "469552118705",
    appId: "1:469552118705:web:98fa6c5262ac8258d79b90"
};

//  Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// get all posts
async function getPosts(db) {
    // const postsSnapshot = await getDocs(itemNameCol, addressCol, emailCol, imageCol);
    //const postList = postsSnapshot.docs.map(doc => doc.data());
    //return postList;
    var postList;

    const q = query(collection(db, "digitalstewardship"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {

        // console.log(doc.id, " => ", doc.data());
        postList = querySnapshot.docs.map(doc => doc.data());

    });
    return postList;
}

async function getItems(db) {
    const itemNameCol = collection(db, 'itemname');

    const itemNameSnapshot = await getDocs(itemNameCol);
    //const addressSnapshot = await getDocs(addressCol);
    //const emailSnapshot = await getDocs(emailCol);
    //const imageSnapshot = await getDocs(imageCol);
    // const postsSnapshot = await getDocs(itemNameCol, addressCol, emailCol, imageCol);
    const itemList = itemNameSnapshot.docs.map(doc => doc.data());
    return itemList;
}


async function addPost(i, a, e, img) {
    const add = await addDoc(collection(db, 'digitalstewardship'), {
        itemname: i,
        address: a,
        email: e,
        image: img
    });

    // console.log("Document written with ID: ", add.id);
}


async function deletePost(postid) {

    var posts = getPosts();

    for (let i = 0; i < posts; i++) {
        if (posts.id == postid) {
            const deletepost = await db.collection('digitalstewardship').remove({

                postid
            })
        }
    }
}

var postList = getPosts(db);
console.log(postList);


for (const [key, value] of Object.entries(postList)) {
    console.log(`${key}: ${value}`);
}


addPost("02/05", "bromms", "me@you.hi", "img.png");