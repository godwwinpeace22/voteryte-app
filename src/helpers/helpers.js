import $store from '../store/store'
import {gun} from '@/plugins/gun'
import api from '@/services/api2'
import ImageKit from 'imagekit-javascript'

export default {

  /**
   * Get a color base on the letter of the alphabet supplied.
   * @param {String} char - the letter of the alphabet (e.g. a)
   * @return A string representing the color (e.g. "yellow")
   */
  colorMinder(char){
    let groups = ['a','b','c','d','m','n','o','p','q','r','s','t',
    'e','f','g','h','u','v','w','x','i','j','k','l','y','z'];
    let charIndex = groups.indexOf(char.toLowerCase()) + 1;

    return charIndex <= 4 ? 'teal' :
    charIndex <= 8 ? 'purple' : 
    charIndex <= 12 ? 'success' : 
    charIndex <= 18 ? 'primary' : 
    charIndex <= 24 ? 'orange' : 
    'primary'
  },
  capitalize(text){
    return text ? text.toLowerCase().split(' ')
      .map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ') : text
  },
  truncateText(text, length=18){

    if(typeof text !== 'string') return

    // strip all line breaks
    let regexp = /\n/g
    text = text.replace(regexp, ' ')

    return text.length > length ?
    text.substr(0, length) + '...' : text 
  },
  trigFileSelector(){
    document.getElementById('file_img').click()
  },
  copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text); 

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {

      var textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(textarea);
      textarea.select();
      try {
          return document.execCommand("copy");  // Security exception may be thrown by some browsers.
      } catch (ex) {
          // console.warn("Copy to clipboard failed.", ex);
          return false;
      } finally {
          document.body.removeChild(textarea);
          // return true
      }
    }
  },
  getRandomString(len=8){
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i=0; i < len; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },
  getRandomNumber(len=6){
    let num = "";
    let possible = "0123456789";

    for( let i=0; i < len; i++ )
      num += possible.charAt(Math.floor(Math.random() * possible.length));

    return num;
  },
  generateUUID() { //-- StackOverflow
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    })
  },


  /**
   * Upload files to storage
   * @param options file upload options
   * @returns String fd
   */
  upload(options){
    return new Promise((resolve, reject ) => {
      
      try {
        
        let {files} = options
        
        Promise.all(
          
          Array.from(files).map((file, index) =>this.uploadOne(file,index, options))

        ).then((urls) => {

          resolve(urls)
          
        }).catch((error) => {

          reject(error)
          
        });
        
      } catch (error) {
        reject(error)
        // console.log(error)
      }
    })
  },
  parseDate(timestamp, show_date=false){
    // show_date is used to control which type of date to return - full date or only time
    // USING CLIENT TIME. MAYBE USE SERVER TIME ?
    // handle firebase timestamp object
    timestamp = typeof timestamp == 'object' ? timestamp.toMillis() : timestamp

    let d = new Date(timestamp)
    let now = Date.now()
    let diff = now - timestamp

    let one_sec = 1000
    let one_min = one_sec * 60
    let one_hour = one_min * 60
    let one_day = one_hour * 24

    let options = {hour:'numeric', minute:'numeric' };
    let options2 = {
      day: 'numeric', 
      year: 'numeric', 
      month: 'short', 
      hour:'numeric', 
      minute:'numeric'
    }
  
    if(diff < 1000){
      return 'just now'
    }
    if(diff > one_sec && diff < one_min){
      return 'a few seconds ago'
    }
    if(diff > one_min && diff < one_hour){
      return Math.floor(diff / one_min) + ' minutes ago'
    }
    if(diff >= one_hour && diff < 2 * one_hour){
      return 'an hour ago'
    }
    if(diff > one_hour && diff < one_day){
      return Math.floor(diff/one_hour)  + ' hours ago'
    }
    if(diff > one_day && diff < one_day * 2){
      return 'yesterday, ' + d.toLocaleString("en-US",options)
    }
    if(diff >= one_day * 2 && diff < one_day * 3){
      return '2d ago at ' + d.toLocaleString("en-US", show_date ? options2 : options)
    }
    return d.toLocaleString("en-US", show_date ? options2 : options)
  },

  sleep (limit=100) {
    return (new Promise((res)=>{
      setTimeout(function(){
        res(limit)
      }, limit);
    }))
  },
  async uploadImage(files,preset){
    // console.log(files, preset)
    try {
      let clUrl = `https://api.cloudinary.com/v1_1/${preset.cloud_name}/upload`
      let formData = new FormData()
      let uploaded = []
      for(let file of files){
        formData.append('file', file)
        formData.append('upload_preset', preset.upload_preset)

        let response = await api().post( clUrl,
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        )

        uploaded.push(response.data.secure_url)
      }
      // eslint-disable-next-line
      // console.log(uploaded)
      return uploaded
    } catch (error) {
      // eslint-disable-next-line
      // console.log(error.response.data)
      // alert('Image upload failed')
      throw new Error(error || error.response.data.message)
      
    }
  },
  async verifyTxn(data){

    if(!data) return;

    return new Promise((resolve,reject) => {

      api().post('/verifyTxn', {
        ref: data.ref,
        amount: data.amount
      })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(err.response ? err.response.data.message : 'Something went wrong')
      })
  
    })


  },
  setCurRoom(rooms){
    // SETS THE DEFAULT OR CURRENT ROOM/ELECTION
    return new Promise((resolve, reject)=>{
      try {
        let found = rooms.find(room => room.electionId == $store.state.curRoomId)
        if(found){
          // why? bcs malicious user can change room from localstorage (bcs its persisted).
          // So we need to check if that room is actually valid (if it exists or user has access to it)
          $store.dispatch('curRoom', found)
          resolve(true)
        }else{
          // either room not set or modified and not matching any valid room
          $store.dispatch('curRoom', rooms[0])
          resolve(true)
        }
      } catch (error) {
        reject(error)
      }
    })
    
    
  },

  followUser(follower, followee){
    return new Promise(async (resolve, reject)=>{
      // helper function to follow a user
      // followee is the one to be followed by follower
      
      try {
        
        let followeeRef = gun.get('users').get(followee.username)
        let followees_count = followee.followers_count || 0
        
        console.log({followeeRef, followees_count})
        
        let is_following = await followeeRef.get('followers')
        .get(follower.username).then()
        console.log({is_following})
        
        // await this.sleep()
        if(is_following){
          // unfollow
          followeeRef
            .get('followers')
            .get(follower.username)
            .put(null)
  
            followeeRef.get('followers_count')
              .put(followees_count - 1)

            resolve({following: false})
  
        }
  
        else{
          
          // follow a user
  
          followeeRef
            .get('followers')
            .get(follower.username)
            .put(true)
            
          followeeRef.get('followers_count')
            .put(followees_count + 1)
          
          // followerRef.get('followers_count')
          //   .put(followers_count + 1)
          
            resolve({following: true})
        }
      } catch (error) {
        console.log(error)
        reject({success: false})
      }
    })
    
  },

  openProfile(event, profile){
    
    profile.x = event.x
    profile.y = event.y
    $store.dispatch('openProfile', profile)
  },
  async uploadMedia({files}){

    return new Promise((resolve, reject) => {

      console.log(files)
      try {
  
        var imagekit = new ImageKit({
          publicKey : "public_UFN7xUAq01gwavZjCcqsFPb/384=",
          urlEndpoint : "https://ik.imagekit.io/voteryte",
          authenticationEndpoint : "http://localhost:5050/api/sign",
      })
  
      let uploaded = []
  
      for(let i = 0; i < files.length; i++){
  
        imagekit.upload({
          file : files[i],
          fileName : files[i].name,
          // tags : ["tag1"]
        }, function(err, result) {

          if(err){
            console.log(err)
            reject(err)
          }

          else {
            
            console.log(arguments);
            let imgUrl =imagekit.url({
              src: result.url,
              // transformation : [{ HEIGHT: options.height, WIDTH: options.width}]
            })

            console.log(imgUrl)
            
            uploaded.push(imgUrl)

            if(i == files.length -1){
              resolve(uploaded)
            }
          }
        })

        
      }
      
        
      } catch (error) {
        // eslint-disable-next-line
        console.log(error)
        reject(error)
        alert('Image upload failed')
        throw new Error(error)
        
      }
    })
  },

}
