import { Component, OnInit } from '@angular/core';

import { Post, BlogService } from '../blog.service';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
	//List details
	posts : Post[];
	username : string;

  subscription: Subscription;
  constructor(private blogService : BlogService, public router : Router) {
    this.subscription = this.blogService.getShout().subscribe(()=>{
      //Update list
      this.blogService.fetchPosts(this.username)
      .then(data => {this.posts = data});
    })
  }



  ngOnInit(): void {
  	this.username = this.blogService.getUsername();

  	//Fetch posts for list
  	this.blogService.fetchPosts(this.username)
  	.then(data => {this.posts = data});


  }

  //find suitable postid and navigate to edit page
  newPost() : void {
    let post = new Post()
    post.postid = this.posts[this.posts.length-1].postid + 1;
    this.blogService.setCurrentDraft(post); // not async

    let url_str = "/edit/" + post.postid.toString();
    this.router.navigate([url_str]);
  }

  //set draft and navigate to edit page
  setDraft(post : Post) : void{
    this.blogService.setCurrentDraft(post); // not async
    let url_str = "/edit/" + post.postid.toString();
    this.router.navigate([url_str]);
  }

  //epoch to string
  toDate(epoch : number) : string{
  	let date = new Date(epoch);
  	return date.toString().substring(3,21);
	}

}



