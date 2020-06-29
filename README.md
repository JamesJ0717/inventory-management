# Stock Tracker/Manager

This purpose of this app is to help people who have trouble keeping track of what they have. This can be things in the pantry or fridge, or even a couponers stockpile; that's where I got the idea.

## Scanning

One of the ways I tried to make this super simple to use was figuring out a fast way to keep track of items. Instead of sitting there and inputing a bunch of information about an item, I thought "Why not use something every product should have, a UPC?"
Barcodes are useful for more than just cashiers at the store. They can be used like a UUID of sorts and there are databases with a lot of these UPCs that contain a lot of data about the product.

```json
{
  "code": "OK",
  "total": 1,
  "offset": 0,
  "items": [
    {
      "ean": "0000060018939",
      "title": "New 808536  Vaseline 50Ml Cocoa Butter Blue Seal (12-Pack) Ointment Cheap Wholesale Discount Bulk Pharmacy Ointment Sponge And Such",
      "description": "Dollaritem is a premier seller of general merchandise and we assure you to receive quality items at a discount.  We sell to businesses and consumers all over the world in bulk to help save you money!  Our company was founded on providing customer service along with excellent warehousing and distribution for over 35 years",
      "upc": "000060018939",
      "brand": "Vaseline",
      "model": "808536",
      "color": "",
      "size": "",
      "dimension": "",
      "weight": "",
      "category": "Health & Beauty > Personal Care > Cosmetics > Skin Care > Lotion & Moisturizer",
      "currency": "",
      "lowest_recorded_price": 6.99,
      "highest_recorded_price": 31.6,
      "images": [
        "https://i5.walmartimages.com/asr/38aa8d09-b6ef-47b2-9339-76801f6c1143_1.324c9a37d2640f12dd57f666636fa0c4.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff"
      ],
      "offers": ...,
      "elid": "264768094566"
    }
  ]
}
```

That is the response from the API I wound up using. As you can see, there is a lot of information there. Some of it not so helpful, like the title `"title": "New 808536 Vaseline 50Ml Cocoa Butter Blue Seal (12-Pack) Ointment Cheap Wholesale Discount Bulk Pharmacy Ointment Sponge And Such"`. It is very long and does not imediately tell the user what the product is.
