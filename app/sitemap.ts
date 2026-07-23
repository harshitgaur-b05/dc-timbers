import { MetadataRoute } from 'next'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import BlogPost from '@/models/BlogPost'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.dctimbers.co.uk'

  // Static routes
  const routes = ['', '/products', '/contact', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    await connectDB()

    // Products & Categories
    const products = await Product.find({}, 'categorySlug slug updatedAt').lean()
    const categories = Array.from(new Set(products.map((p) => p.categorySlug)))

    const categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/products/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${p.categorySlug}/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Blog posts
    const posts = await BlogPost.find({ published: true }, 'slug updatedAt').lean()
    const blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...routes, ...categoryRoutes, ...productRoutes, ...blogRoutes]
  } catch {
    return routes
  }
}
