import React, { Component } from "react";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import Loader from '../app-components/Loader';
import { browserHistory } from 'react-router';
import defaultavatar from '../../defaultavatar.png';
import '../stylesheet/loader.css';
import './view-stylesheet/post.css';
import Cookies from "universal-cookie";

const cookie = new Cookies();
export default class Post extends Component {
  constructor(props){
    super(props);
    this.state = {postID:null,likeStatus:false,data:null,voteNumber:0,userid:1,username:'anonymous',postTime:'loading', allowDelete:false}
    //Props url
    //home: display in HOMEPAGE
    //subforum: display in SUB-FORUM PAGE
    //null: display in THREAD PAGE
    this.handleLikeBtn = this.handleLikeBtn.bind(this);
    this.handleDeleteBtn = this.handleDeleteBtn.bind(this);
  }

  fetchData(id,userID){
    //fetch data

    fetch('https://ride-hub.herokuapp.com/api/post/'+id)
    .then(response => {
        if(response.status===200){
            response.json().then(data => {
                //Content
                var cfg = {};
                var converter = new QuillDeltaToHtmlConverter(data.content, cfg);
                var html = converter.convert(); 
                //Time
                var time = this.parseDateTime(data["creation_date"]);
                this.setState({
                    voteNumber:data.vote_number,
                    likeStatus:data.user_vote_state,
                    data:html,
                    username:data.username,
                    postTime:time
                })
                //Check later;
                this.setState({allowDelete:true})
            });
        }
    })

  }

  componentDidMount() {
    //Set state
    this.postID = this.props.postID;
    this.setState({postID:this.props.postID})
    this.fetchData(this.postID,this.state.userid)
    
  }

  componentDidUpdate(){
      if(this.state.postID!==this.props.postID){
          this.setState({postID:this.props.postID})
          this.fetchData(this.props.postID,this.state.userid)
          
      }
      if(cookie.get("userid")==null){
        if(this.state.allowDelete){
            this.setState({allowDelete:false})
        }
        }else{
            if(!this.state.allowDelete){
                this.setState({allowDelete:true})
            }
        }
  }
  getDateTime(){
    let currentdate = new Date(); 
    let a =  currentdate.getFullYear()+ "-"+ (currentdate.getMonth()+1) + "-"+ currentdate.getDate() + " "+ currentdate.getHours() + ":"  + currentdate.getMinutes() + ":"  + currentdate.getSeconds();
    return a;
  }

  handleDeleteBtn(){
    if(this.state.allowDelete)
        if(this.type==='comment-post'&&window.confirm("You will not see this post forever ever")){
            fetch('https://ride-hub.herokuapp.com/api/post/'+this.state.postID, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
                }).then(response =>{
                if(response.ok){
                    alert("Post deleted");
                    window.location.href = window.location.href;
                }else{
                    if(response.status==403){
                        alert("You must be owner of this post to delete it")
                    }else{
                        alert("Error:"+response.status);
                    }
                }
            })
        }else if(window.confirm("Are you sure to say bye bye to this thread?")){
            fetch('https://ride-hub.herokuapp.com/api/thread/'+this.props.threadID, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
                }).then(response =>{
                if(response.ok){
                    alert("Thread deleted");
                    browserHistory.push('/');
                }else{
                    if(response.status==403){
                        alert("You must be owner of this thread to delete it")
                    }else{
                        alert("Error:"+response.status);
                    }
                }
            })
        }
    
  }

  handleLikeBtn(){
      let is_vote;
      let voteNum = Number(this.state.voteNumber);
    if(this.state.likeStatus){
        voteNum-=1;
        this.setState({likeStatus:false,voteNumber:voteNum})
        is_vote=false;
    }else{
        voteNum+=1
        this.setState({likeStatus:true,voteNumber:voteNum})
        is_vote=true;
    }
    fetch('https://ride-hub.herokuapp.com/api/post/vote', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          is_vote:is_vote,
          post_id:this.state.postID,
          creation_date:this.getDateTime()
      })
      }).then(response=>{
        if(!response.ok){
            console.log('Error: '+response.status);
            is_vote=!is_vote;
            if(is_vote){
                voteNum+=1
            }else{
                voteNum-=1
            }
            this.setState({likeStatus:is_vote,voteNumber:voteNum})
            if(response.status===403){
                alert('You must log in to use this function')
            }
        }
      }
      )
  }

  parseDateTime(timeString){
    let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
        ];
    let year = Number(timeString.substring(0,4))
    let month = Number(timeString.substring(5,7))
    let date = Number(timeString.substring(8,10))
    let h = Number(timeString.substring(11,13))
    let m = timeString.substring(14,16); 
    let od;
    if(date>3)
        od="th"
    else if(date===3)
        od = "rd"
    else if(date===2)
        od = "nd"
    else if(date===1)
        od = "st"
    let result = h+":"+m+ " "+months[month-1]+" "+date+od+" "+year;
    return result;
  }

  render() {
    //Variable
    //Default variable
    this.profilePicture = defaultavatar;
    if(this.state.data!==null){
        this.content =<td dangerouslySetInnerHTML={{__html: this.state.data}} />
    }else{
        this.content = <Loader/>
    }
    //this.content = 'post '+String(this.state.postID)+' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
    //Temp
    this.type = this.props.type;
    //Vote Button
    if(this.state.likeStatus){
        this.likeBtn=<i className="fas fa-heart"></i>
    }else{
        this.likeBtn=<i className="far fa-heart"></i>
    }
    if(this.state.allowDelete){
        this.deleteBtn = <i className="far fa-trash-alt"></i>
    }else{
        this.deleteBtn = ""
    }
    if(this.type === "original-post"||this.type==='comment-post'){
        
    return (
        <div className={this.type}>
            <div className="post-info-wrapper">
                <div className="avatar">
                    <img src={this.profilePicture} alt="userProfilePicture"></img>
                </div>
                <div className="post-info">
                    <div className="username">
                        {this.state.username}
                    </div>
                    <div className="post-time">
                        {this.state.postTime}
                    </div>
                </div>
                
                <div className={"like-btn "+this.state.allowDelete}>
                
                    <button type="button" className={'btn btn-link '+this.state.likeStatus} onClick={this.handleLikeBtn}>
                        {this.likeBtn}
                    </button>     
                    <div className="number">
                        {this.state.voteNumber + " likes"}
                    </div>
                    <div className="delete-btn">
                        <button type="button" className={'btn btn-link '} onClick={this.handleDeleteBtn}>
                            {this.deleteBtn}
                        </button> 
                    </div>
                </div>
                
            </div>
            <div className="post-content-wrapper">
                {this.content}
            </div>
        </div>
    );
    }else {
        return (
        <div>Not found!</div>
        );
    }
      
  }
}

