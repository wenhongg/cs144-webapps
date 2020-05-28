package wenhong.project2;

import java.sql.Timestamp;

public class PostEntry{
	public String title;
	public Timestamp created;
	public Timestamp modified;
	public Integer postid;

	public PostEntry(String t, Timestamp c, Timestamp m, int p){
		title = t;
		created = c;
		modified = m;
		postid = p;
	}

	public String getModified(){
		return modified.toString().substring(0,19);
	}
	public String getCreated(){
		return modified.toString().substring(0,19);
	}
}