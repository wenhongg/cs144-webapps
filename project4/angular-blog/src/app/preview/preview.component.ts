import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Parser, HtmlRenderer } from 'commonmark';
import { Post, BlogService } from '../blog.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
	//html strings
	title : string;
	body : string;

	postid : number;
	post : Post;

	writer : HtmlRenderer;
	reader : Parser;
  constructor(private activatedRoute: ActivatedRoute, public router: Router, private blogService : BlogService) {}

  ngOnInit(): void {
  	//init commonmark tools
  	this.writer = new HtmlRenderer();
		this.reader = new Parser();

  	this.activatedRoute.paramMap.subscribe(() => {
  		this.postid = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
  		this.getPost();
    });
  }

  getPost(): void {
  	this.post = this.blogService.getCurrentDraft();

  	if(this.post==null || this.post.postid!=this.postid){ //add case for url and post not match
  		//full promise
  		this.blogService.getPost(this.blogService.getUsername(), this.postid)
      .then(post => {this.post = post})
      .then(()=>{this.generateHTML()});
  	} else {
  		//non promise
  		this.generateHTML();
  	}
  }

  editPost(): void {
  	this.blogService.setCurrentDraft(this.post);
		let url_str : string = "/edit/" + this.postid;
    this.router.navigate([url_str]);
  }

  generateHTML() {
  	this.title = this.writer.render(this.reader.parse(this.post.title));
  	this.body = this.writer.render(this.reader.parse(this.post.body));
  }

}
