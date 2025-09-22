# Project Brief: Fiyova

## Project Overview
Fiyova is a modern e-commerce platform built with Next.js 15, Tailwind CSS v4, and HeroUI components. The platform integrates with Dodo Payments for payment processing and product management.

## Core Requirements
- **E-commerce Platform**: Product catalog, individual product pages, and checkout flow
- **Payment Integration**: Full integration with Dodo Payments API for products, customers, and payments
- **Modern UI**: Clean, accessible design using HeroUI components and Tailwind CSS
- **Performance**: Server-side rendering with Next.js 15 and optimized data fetching

## Key Features
1. **Product Management**: Dynamic product catalog fetched from Dodo Payments API
2. **Payment Processing**: Complete checkout flow with Dodo Payments integration
3. **User Experience**: Responsive design with smooth navigation and clear feedback
4. **Webhook Handling**: Secure webhook processing for payment status updates

## Success Criteria
- Users can browse products from Dodo Payments API
- Complete payment flow from product selection to success page
- Secure payment processing with proper error handling
- Responsive design that works across all devices
- Fast loading times with server-side rendering

## Technical Constraints
- Must use Dodo Payments API for all payment operations
- Server Components for data fetching to avoid client-side API calls
- Proper error handling and graceful degradation
- Environment-based configuration for different deployment stages
