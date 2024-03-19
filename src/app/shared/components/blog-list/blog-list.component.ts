import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Blog } from '../../models/blog';
import { MatIconModule } from '@angular/material/icon';
import { BlogService } from '../../../core/services/blog.service';
@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {
  constructor(private blogService: BlogService) { }
  @Input({required: true}) blogs: Blog[] = []
  @Output() onChangeBlogs: EventEmitter<Blog[]> = new EventEmitter<Blog[]>();
  toggleLiked(blogId: number) {
    const blogs = [...this.blogs];
    const blogIndex = blogs.findIndex((blog) => blog.id === blogId);

    if (blogIndex === -1) return;

    const blog = blogs[blogIndex];
    const isLiked = blog.liked;
    const blog$ = isLiked
      ? this.blogService.unLikeBlog(blogId)
      : this.blogService.likeBlog(blogId);

    blog.liked = !isLiked;

    blog$.subscribe({
      next: () => {
        blog.likes_count! += isLiked ? -1 : 1;
        this.onChangeBlogs.emit(blogs);
      },
      error: (error) => {
        console.error('Error toggling like status:', error);
        blog.liked = isLiked;
      },
    });
  }
  
}
