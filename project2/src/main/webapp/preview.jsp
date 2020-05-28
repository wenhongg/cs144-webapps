<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Preview</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
    <form action="post" method="post" class="top_form">
        <input type="hidden" name="username" value='<%= request.getParameter("username") %>'>
        <input type="hidden" name="postid" value='<%= request.getParameter("postid") %>'>
        <input type="hidden" name="title" value='<%= request.getParameter("title") %>'>
        <input type="hidden" name="body" value='<%= request.getParameter("body") %>'>
        
        <button type="submit" name="action" value="open">Close preview</button>
    </form>
    <div class="content">
        <h1><%= request.getAttribute("title") %></h1>
    </div>
    <div class="content">
        <%= request.getAttribute("parsed_body") %>
    </div>
</body>
</html>
