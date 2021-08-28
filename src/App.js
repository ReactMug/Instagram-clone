import './App.css';
import Post from './Post'
import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import React from 'react';
import { Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,

    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([])
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false);
  const [openSignin, setSignin] = useState(false);
  useEffect(() => {

    const unsubcribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        ///// user has logged in...
        setUser(authUser)
      } else {
        setUser(null)
      }
    })
    return () => {
      unsubcribe();
    }
  }, [user, username])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSignInOpen = () => {
    setSignin(true);
  };

  const handleSignInClose = () => {
    setSignin(false);
  };
  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })));
    })
  }, [])
  const signup = (event) => {
    event.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile(
          {
            displayName: username
          }
        )
      })
      .catch((err) => alert(err.message));
    setUsername('')
    setEmail('')
    setPassword('')
    handleSignInClose()
  }
  const signin = (event) => {
    event.preventDefault()
    auth.signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));
    setSignin(false)
    setEmail('')
    setPassword('')
  }
  return (
    <div className="App">
      <Modal
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='App__signup'>
            <center>
              <img
                className='App__img'
                alt=''
                src='https://www.logo.wine/a/logo/Instagram/Instagram-Wordmark-Black-Logo.wine.svg' />
            </center>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="UserName" />
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" />
            <Button onSubmit='submit' type="button" onClick={signup}>
              Sign up
            </Button>
          </form>

        </div>
      </Modal>
      {/* Sign In Modal Here.... */}
      <Modal
        open={openSignin}
        onClose={handleSignInClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='App__signup'>
            <center>
              <img
                className='App__img'
                alt=''
                src='https://www.logo.wine/a/logo/Instagram/Instagram-Wordmark-Black-Logo.wine.svg' />
            </center>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" />
            <Button type='submit' onClick={signin}>
              Sign In
            </Button>
          </form>

        </div>
      </Modal>
      <div className='App__header'>
        <img
          className='App__img'
          alt=''
          src='https://www.logo.wine/a/logo/Instagram/Instagram-Wordmark-Black-Logo.wine.svg' />
        {
          user ? (
            <Button type="submit" onClick={() => auth.signOut()}>
              Logout
            </Button>
          ) : (
            <div className='App__AuthticationButton' >
              <Button type="button" onClick={handleSignInOpen}> Sign in</Button>
              <Button type="button" onClick={handleOpen}> Signup</Button>
            </div>
          )
        }
      </div>
      <div className='App__post'>
        <div className='App__postLeft'>
          {
            posts.map(({ id, post }) =>
              <Post
                user={user}
                key={id}
                postId={id}
                caption={post.caption}
                username={post.username}
                imageURL={post.imageURL} />)
          }
        </div>
        <div className='App__postRight'>
          <InstagramEmbed
            url='https://www.instagram.com/p/CSy15osDDAz/'
            clientAccessToken='892972827986792|872504670335235'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>
      {
        user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : <h2>
          Please Login for Uploading Image
        </h2>
      }
    </div>
  );
}

export default App;
