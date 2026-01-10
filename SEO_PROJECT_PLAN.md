# Velcorix Website SEO Implementation Plan

This plan outlines the steps to further improve the SEO and professional visibility of the Velcorix website, building upon the recently updated meta descriptions.

## Phase 1: Technical & Structural Improvements (High Priority)

### 1.1 Heading Hierarchy Optimization

- **Objective**: Ensure each page has exactly one unique `<h1>` tag.
- **Scope**:
  - `index.html`: Convert the second and third slides' titles from `<h1>` to `<h2>`.
  - Review all service and rental pages to ensure sub-sections use `<h2>` through `<h5>` correctly.

### 1.2 Canonical Tags Implementation

- **Objective**: Prevent duplicate content issues.
- **Scope**: Add `<link rel="canonical" href="https://www.velcorix.com/[file-path]" />` to the `<head>` of every HTML file in the project.

### 1.3 Open Graph (OG) Integration

- **Objective**: Improve the appearance of links when shared on LinkedIn and social media.
- **Scope**:
  - Standardize `og:title`, `og:description`, `og:image`, and `og:url` across all pages.
  - Ensure each service page has a specific `og:description` based on the meta description.

---

## Phase 2: Enhanced Search Visibility (Medium Priority)

### 2.1 Structured Data (Schema Markup)

- **Objective**: Help Google display rich snippets and understand the business structure.
- **Scope**:
  - Add `Organization` and `LocalBusiness` schema to `index.html`.
  - Add `Service` or `Product` schema to specific service and rental pages.

### 2.2 Image Optimization (Alt Text)

- **Objective**: Improve indexing for image search.
- **Scope**:
  - Review `index.html`, `services.html`, and `rentals.html`.
  - Update generic `alt` attributes to include descriptive, keyword-rich phrases (e.g., "Industrial generator for rent in Dubai").

---

## Phase 3: Content & Performance Review (Ongoing)

### 3.1 Content Keyword Alignment

- **Objective**: Improve ranking for high-intent technical search terms.
- **Scope**:
  - Select top-5 service pages (e.g., Flange Management, EPC, Rentals).
  - Ensure key terms (UAE, Dubai, specific equipment names) appear naturally in the body text twice.

### 3.2 Mobile-Friendly & Speed Check

- **Objective**: Maintain high Core Web Vitals scores.
- **Scope**: Verify that Bootstrap utilities are used efficiently and images are compressed.

---

## Execution Progress Tracker

| Task ID | Task Description                       | Status    |
| :------ | :------------------------------------- | :-------- |
| T1      | Fix H1 hierarchy in `index.html`       | Completed |
| T2      | Add Canonical tags to all pages        | Completed |
| T3      | Implement Open Graph tags to all pages | Completed |
| T4      | Add JSON-LD Schema to `index.html`     | Completed |
| T5      | Update Image Alt Text for main pages   | Completed |
| T6      | Content Keyword Optimization           | Completed |
