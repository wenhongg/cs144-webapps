import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Post, BlogService } from '../blog.service';

import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
	post : Post;
  postid : number;

  title: string;
  body: string;
  constructor(private activatedRoute: ActivatedRoute, public router: Router, private blogService : BlogService) {
    
  }
  
  ngOnInit(): void {
  	//Collect the post from blogservice
    this.activatedRoute.paramMap.subscribe(() => {
      this.postid = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
      this.getPost();
    });
    
  }

  //3 buttons

  deletePost(): void {
  	this.blogService.deletePost(this.blogService.getUsername(), this.post.postid)
    .then(()=>{this.makeUpdate(true)});
    this.router.navigate(['/']);
  }

  savePost(): void {
  	//If post is defined, its an update, else its a new post
  	if(this.post.created!=undefined){
  		this.blogService.updatePost(this.blogService.getUsername(), this.post)
      .then(()=>{this.makeUpdate(false)});
  	} else {
  		this.blogService.newPost(this.blogService.getUsername(), this.post)
      .then(()=>{this.makeUpdate(false)});
  	}
    
  }

  previewPost(): void {
    //save current draft for preview component to get
    this.blogService.setCurrentDraft(this.post);
    let url_str : string = "/preview/" + this.postid;
    this.router.navigate([url_str]);
  }

  makeUpdate(isDelete : boolean) : void{
    //Update current blog
    if(!isDelete){
      this.blogService.getPost(this.blogService.getUsername(), this.post.postid)
      .then(post => {this.post = post});
    }
    this.blogService.sendShout();
  }


  getPost(): void {
  	this.post = this.blogService.getCurrentDraft();

  	if(this.post==null || this.post.postid!=this.postid){ //add case for url and post not match
      //empty post to ensure no errors thrown by undefined
      this.post = new Post();
      this.post.title = "";
      this.post.body = "";

  		this.blogService.getPost(this.blogService.getUsername(), this.postid)
      .then(post => {this.post = post});
  	}
  }

  //epoch to string
  toDate(epoch : number) : string{
    if(epoch==undefined){
      return "-";
    }

  	let date = new Date(epoch);
  	return date.toString().substring(3,21);
	}

}

//TODO after post is done must refresh things