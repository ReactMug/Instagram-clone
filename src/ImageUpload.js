import React from 'react'
import { useState, } from 'react';
import Button from '@material-ui/core/Button';
import firebase from 'firebase'
import { db, storage } from './firebase';
import './ImageUpload.css'
function ImageUpload({ username }) {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const uploadFilesToServer = () => {
        if (image !== null) {
            const uploadTask = storage.ref(`/images/${image.name}`).put(image);;
            uploadTask.on("state_changed", (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress);
            },
                (error) => {
                    console.log(error);
                    alert(error.message)
                },
                () => {
                    storage
                        .ref('images')
                        .child(image.name)
                        .getDownloadURL()
                        .then((url) => {
                            db.collection('posts').add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                caption: caption,
                                imageURL: url,
                                username: username
                            });
                            setProgress(0)
                            setImage(null)
                            setCaption('')
                        });
                }
            );
        }

    }
    const handleFileImage = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0])
        }
    }
    return (
        
        <div className='ImageUpload'>
            <progress value={progress} max='100' />
            <input
                type='text'
                placeholder='Enter your caption'
                value={caption}
                onChange={(e) => setCaption(e.target.value)} />
            <input type='file' onChange={handleFileImage} />
            <Button type="submit" onClick={uploadFilesToServer}>
                Upload
            </Button>
        </div>
    )

}


export default ImageUpload
