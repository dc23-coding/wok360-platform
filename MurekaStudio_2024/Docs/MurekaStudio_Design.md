from pathlib import Path

# Define the content of the markdown file
markdown_content = """
# Mureka Studio – Design Documentation

## 📦 Overview

This document describes the **UI/UX decisions**, **component specifications**, and **developer guidance** for the **Mureka Studio UX System**. It is intended for **Patch (Developer)** and **Echo (Technical Writer)** to complete production delivery.

---

## 🎨 Design Rationale

Mureka Studio is built to provide creators with a **simple**, **mobile-first**, and **accessible** experience for:
- Recording vocals
- Typing lyrics
- Uploading audio files
- Viewing and interacting with community remixes

The design prioritizes:
- Clear call-to-action buttons
- Responsive layouts for all device sizes
- Consistent typography and color usage

---

## 🧩 Component Specifications

### ✅ Buttons
| Property       | Value                  |
|----------------|------------------------|
| Base Color     | `#2563EB` (Blue 600)    |
| Hover Color    | `#1D4ED8` (Blue 700)    |
| Text Color     | `#FFFFFF` (White)       |
| Border Radius  | `0.375rem` (6px)        |
| Padding        | `0.5rem 1rem` (8px 16px) |

### ✅ Inputs
| Type     | Styles                              |
|---------|-------------------------------------|
| Text    | Gray border, rounded, full width     |
| TextArea| Full width, fixed height (128px)     |
| File    | Default browser file upload styling  |

### ✅ Cards
| Property       | Value                     |
|----------------|---------------------------|
| Border Color   | `#E5E7EB` (Gray 300)       |
| Background    | `#FFFFFF` (White)          |
| Padding        | `1rem` (16px)              |
| Shadow         | Subtle drop shadow         |
| Border Radius  | `0.375rem` (6px)           |

### ✅ Modals
| Property       | Value                     |
|----------------|---------------------------|
| Background     | `#FFFFFF` (White)          |
| Overlay        | `rgba(0,0,0,0.5)`          |
| Max Width      | `512px`                    |
| Padding        | `1.5rem` (24px)            |
| Centered Layout| Yes                        |

---

## 🛠️ Implementation Notes

- Components mapped to `/src/components/mureka`
- Vue 3 Single File Components (`.vue`)
- Responsive breakpoints:
  - `sm`: 375px
  - `md`: 768px
  - `lg`: 1024px

---

## ♿ Accessibility Compliance

- **Text Contrast** meets WCAG AA standards
- **Buttons** are keyboard focusable
- **Tap Targets** are minimum 44x44px
- **Modals** trap focus when open

---

## 📲 User Flow Diagram

1. **Landing Page ➡ Studio Home**
2. **Studio Home ➡ Record | Text | Upload**
3. **Submission ➡ Remix Feed View**

---

## 🧑‍💻 Developer Guide

1. Reference `/Designs/MurekaUXSystem.fig`
2. Match layout to provided **wireframes**
3. Use exported **SVG/PNG assets** where applicable
4. Follow this document for **consistent spacing, colors, and accessibility**

---

## 📝 Writer's Checklist

- Prepare **user onboarding**
- Create **feature descriptions**
- Document **user interaction flows**
- Provide **help and FAQ content**

---

## ✅ Status

> [ ] **Design Review Complete**  
> [ ] **Developer Approved**  
> [ ] **Writer Approved**
"""

# Write the content to a markdown file
output_file = Path("/mnt/data/MurekaStudio_Design.md")
output_file.write_text(markdown_content)

# Output the file path for download
output_file
