import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
	//saves a draft
	draft : Post;
  constructor() {}

  //observer observable
  private subject = new Subject<any>();
  getShout(): Observable<any> {
  	return this.subject.asObservable();
  }
  sendShout() : void {
  	this.subject.next();
  }

  async fetchPosts(username: string): Promise<Post[]> {
  	let data : Post[] = [];
  	let url_str : string = "/api/" + username;

  	let response = await fetch(url_str);
  	let obj = await response.json();

		await obj.forEach(entry => {data.push(entry);})
		return data;
  }

  //untested
  async getPost(username: string, postid: number): Promise<Post> {
  	let url_str : string = "/api/" + username + "/" + postid.toString();

  	let response = await fetch(url_str);
  	let obj = await response.json();

  	//assumes that error will be thrown by API
		return obj[0];
  }

  async newPost(username: string, post: Post): Promise<void> {
  	let postid : string = post.postid.toString();
  	let url_str : string = "/api/" + username + "/" + postid;

  	let response = await fetch(url_str, 
  		{
  			method: 'POST', 
  			credentials: 'include', 
  			headers: {'Content-Type': 'application/json'}, 
  			body: JSON.stringify(post)
  		}
  	);
  }
  async updatePost(username: string, post: Post): Promise<void> {
  	let postid : string = post.postid.toString();
  	let url_str : string = "/api/" + username + "/" + postid;

  	let response = await fetch(url_str, 
  		{
  			method: 'PUT', 
  			credentials: 'include', 
  			headers: {'Content-Type': 'application/json'}, 
  			body: JSON.stringify(post)
  		}
  	);
  }
  async deletePost(username: string, postid: number): Promise<void>{
  	let url_str : string = "/api/" + username + "/" + postid;


  	let response = await fetch(url_str, {method: 'DELETE'});
  }

  setCurrentDraft(post: Post): void {
  	this.draft = post;
  }

  getCurrentDraft(): Post {
  	return this.draft;
  }
  getUsername(): string {
  	let token : string = document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  	return parseJWT(token).username;
  }

}

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}

function parseJWT(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}
