# Product Update API Instructions for Frontend Developers

## Endpoint
```
PUT /api/v1/admin/products/:id
```

## Authentication
- **Required**: Admin authentication token
- **Header**: `Authorization: Bearer <token>`

## Request Format
- **Content-Type**: `multipart/form-data` (for file uploads) or `application/json`
- **ID Parameter**: Use the actual MongoDB ObjectId (24-character hex string)

## Data Format Requirements

### ✅ Correct Data Types

#### Basic Fields
```json
{
  "name": "Product Name",                    // String
  "subtitle": "Product subtitle",            // String
  "category": "Trial Pack",                  // String (enum: "Trial Pack", "Gift Box", "Full Size")
  "type": ["Black", "Masala"],               // Array of strings
  "flush": "Summer",                         // String (enum: "Spring", "Summer", "Autumn", "Winter")
  "region": "Assam",                         // String
  "packaging": "Whole Leaf",                 // String (enum: "Teabags", "Whole Leaf")
  "quantity": "100g",                        // String
  "price": 499,                              // Number (not string!)
  "offer": "Buy 2 Get 1 Free",              // String
  "gift_included": "Free Glass Infuser",    // String
  "rating": 4.9,                             // Number (not string!)
  "reviewCount": 185,                        // Number (not string!)
  "badges": ["New", "Bestseller"],          // Array of strings
  "taste_notes": ["Spicy", "Bold"],         // Array of strings
  "tags": ["masala", "chai"],               // Array of strings
  "images": ["url1", "url2"],               // Array of strings
  "qr_code": "https://example.com",         // String
  "description": "Product description"      // String
}
```

#### Nested Objects

**Origin Object:**
```json
{
  "origin": {
    "garden_name": "Doomni Estate",         // String
    "elevation_ft": 1800,                   // Number (not string!)
    "harvest_date": "2025-01-03T18:30:00.000Z"  // Date string (ISO format)
  }
}
```

**Brewing Object:**
```json
{
  "brewing": {
    "temperature_c": 100,                   // Number (not string!)
    "time_min": 5,                          // Number (not string!)
    "method": "Simmer with milk"            // String
  }
}
```

**Scan to Brew Object:**
```json
{
  "scan_to_brew": {
    "video_url": "https://example.com/video.mp4",  // String
    "steps": ["Step 1", "Step 2"],                 // Array of strings
    "timer_seconds": 300                           // Number (not string!)
  }
}
```

### ❌ Common Mistakes to Avoid

#### 1. **String Numbers** (Will cause CastError)
```json
// ❌ WRONG - Don't send numbers as strings
{
  "price": "499",                    // Should be: 499
  "rating": "4.9",                   // Should be: 4.9
  "reviewCount": "185",              // Should be: 185
  "origin": {
    "elevation_ft": "1800"           // Should be: 1800
  },
  "brewing": {
    "temperature_c": "100",          // Should be: 100
    "time_min": "5"                  // Should be: 5
  },
  "scan_to_brew": {
    "timer_seconds": "300"           // Should be: 300
  }
}
```

#### 2. **Empty Strings** (Will cause CastError)
```json
// ❌ WRONG - Don't send empty strings for number/date fields
{
  "origin": {
    "harvest_date": "",              // Should be: undefined or valid date
    "elevation_ft": ""               // Should be: undefined or number
  },
  "brewing": {
    "temperature_c": "",             // Should be: undefined or number
    "time_min": ""                   // Should be: undefined or number
  },
  "scan_to_brew": {
    "timer_seconds": ""              // Should be: undefined or number
  }
}
```

#### 3. **Malformed Arrays** (Will cause CastError)
```json
// ❌ WRONG - Don't send malformed array data
{
  "type": "[ { '0': 'Black', '1': 'Masala' } ]",  // Should be: ["Black", "Masala"]
  "badges": "['New', 'Bestseller']",              // Should be: ["New", "Bestseller"]
  "taste_notes": "['Spicy', 'Bold']"              // Should be: ["Spicy", "Bold"]
}
```

#### 4. **Invalid Date Formats** (Will cause CastError)
```json
// ❌ WRONG - Don't send invalid date formats
{
  "origin": {
    "harvest_date": "invalid-date",  // Should be: "2025-01-03T18:30:00.000Z"
    "harvest_date": "",              // Should be: undefined
    "harvest_date": '""'             // Should be: undefined
  }
}
```

#### 5. **Wrong ID Format**
```json
// ❌ WRONG - Don't use slug in URL
PUT /api/v1/admin/products/darjeeling-earl-grey

// ✅ CORRECT - Use ObjectId
PUT /api/v1/admin/products/665cdfc23bff8a95e4f66c01
```

## File Upload (Optional)
If uploading images:
- Use `multipart/form-data`
- Field name: `files` (array)
- Supported formats: jpg, jpeg, png, gif
- Max file size: 5MB per file

## Response Format

### Success Response (200)
```json
{
  "statusCode": 200,
  "data": {
    "_id": "665cdfc23bff8a95e4f66c01",
    "name": "Updated Product Name",
    "price": 499,
    "type": ["Black", "Masala"],
    "origin": {
      "garden_name": "Doomni Estate",
      "elevation_ft": 1800,
      "harvest_date": "2025-01-03T18:30:00.000Z"
    },
    // ... other fields
  },
  "message": "Product updated successfully",
  "success": true
}
```

### Error Responses

#### 400 - Invalid Product ID
```json
{
  "statusCode": 400,
  "message": "Invalid product ID",
  "success": false
}
```

#### 404 - Product Not Found
```json
{
  "statusCode": 404,
  "message": "Product not found",
  "success": false
}
```

#### 500 - CastError (Data Type Issues)
```json
{
  "statusCode": 500,
  "message": "CastError: Cast to Number failed for value \"\" (type string) at path \"price\"",
  "success": false
}
```

## Frontend Implementation Tips

### 1. **Data Validation Before Sending**
```javascript
// Validate and convert data types
const validateProductData = (data) => {
  const validated = { ...data };
  
  // Convert string numbers to actual numbers
  if (validated.price) validated.price = Number(validated.price);
  if (validated.rating) validated.rating = Number(validated.rating);
  if (validated.reviewCount) validated.reviewCount = Number(validated.reviewCount);
  
  // Handle nested objects
  if (validated.origin) {
    if (validated.origin.elevation_ft) {
      validated.origin.elevation_ft = Number(validated.origin.elevation_ft);
    }
    if (validated.origin.harvest_date === '') {
      validated.origin.harvest_date = undefined;
    }
  }
  
  if (validated.brewing) {
    if (validated.brewing.temperature_c) {
      validated.brewing.temperature_c = Number(validated.brewing.temperature_c);
    }
    if (validated.brewing.time_min) {
      validated.brewing.time_min = Number(validated.brewing.time_min);
    }
  }
  
  if (validated.scan_to_brew) {
    if (validated.scan_to_brew.timer_seconds) {
      validated.scan_to_brew.timer_seconds = Number(validated.scan_to_brew.timer_seconds);
    }
  }
  
  return validated;
};
```

### 2. **Handle Empty Values**
```javascript
// Remove empty strings and convert to undefined
const cleanEmptyValues = (obj) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === '' || value === '""' || value === '""""') {
      cleaned[key] = undefined;
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = cleanEmptyValues(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
};
```

### 3. **Example API Call**
```javascript
const updateProduct = async (productId, productData) => {
  try {
    // Clean and validate data
    const cleanedData = cleanEmptyValues(productData);
    const validatedData = validateProductData(cleanedData);
    
    const response = await fetch(`/api/v1/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(validatedData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};
```

## Testing Checklist
- [ ] All number fields are sent as numbers, not strings
- [ ] Empty strings are converted to `undefined` or removed
- [ ] Arrays are properly formatted (not stringified)
- [ ] Date fields use ISO format or are `undefined`
- [ ] Product ID in URL is a valid ObjectId
- [ ] Authentication token is included
- [ ] File uploads use `multipart/form-data` if needed

## Common Error Messages and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Cast to Number failed` | String sent instead of number | Convert to number before sending |
| `Cast to Date failed` | Invalid date format | Use ISO date string or `undefined` |
| `Cast to [string] failed` | Malformed array | Send proper array, not stringified |
| `Invalid product ID` | Wrong ID format | Use ObjectId, not slug |
| `Product not found` | ID doesn't exist | Verify product exists |

## Support
If you encounter persistent issues, check:
1. Network tab for exact request/response
2. Server logs for detailed error messages
3. Data validation in your frontend code
4. Authentication token validity 