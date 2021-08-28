import React, { useState, useEffect } from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase'

function Post(props) {
    const [comments, setcomments] = useState([])
    const [comment, setcomment] = useState([])

    useEffect(() => {
        let unsubscribe;
        if (props.postId) {
            unsubscribe = db.collection('posts')
                .doc(props.postId)
                .collection('comments')
                .orderBy('timeStamp', 'desc')
                .onSnapshot((snapShot) => {
                    setcomments(snapShot.docs.map((doc) => doc.data()));
                })
        }
        return () => {
            unsubscribe();
        }
    }, [props.postId])


    const postComment = (event) => {
        event.preventDefault()
        db.collection('posts')
            .doc(props.postId)
            .collection('comments')
            .add({
                text: comment,
                username: props.user.displayName,
                timeStamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        setcomment('');
    }
    return (
        <div className='Post'>
            <div className="Post__header">
                <Avatar
                    className='Post__Circle'
                    alt={props.username}
                    src="/static/images/avatar/1.jpg" />
                <h3>{props.username}</h3>
            </div>
            <img
                className='Post__image'
                alt=''
                src={props.imageURL} />
            <h4 className='Post__text'>
                <strong>{props.username} </strong>
                {props.caption}
            </h4>
            <div className='post__comments'>
                {
                    comments.map((comment) => {
                        return <p>
                            <strong>{comment.username}</strong>&nbsp;
                            {comment.text}
                        </p>
                    })
                }

            </div>
            {
                props.user && (
                    <form className='post__commentBox'>
                        <input
                            className='post__input'
                            placeholder='Add a comment...'
                            value={comment}
                            onChange={(event) => setcomment(event.target.value)}
                        />
                        <button
                            className='post__button'
                            type='submit'
                            disabled={!comment}
                            onClick={postComment}
                        >
                            Post
                        </button>
                    </form>
                )
            }
        </div>
    )
}

export default Post
