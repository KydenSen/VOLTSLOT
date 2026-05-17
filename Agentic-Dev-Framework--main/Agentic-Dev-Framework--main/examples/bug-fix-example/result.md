# Final Output: Safari Button Fix

*(The resulting code patch applied by the Coder agent during Quick Fix mode)*

### `public/js/checkout.js` (Diff)
```javascript
 function initializeCheckoutButton() {
   const checkoutForm = document.getElementById('payment-form');
-  const payButton = document.getElementById('pay-now-btn');
   
-  payButton.addEventListener('click', (e) => {
+  checkoutForm.addEventListener('submit', (e) => {
+    e.preventDefault();
     
     // Original validation logic
     if (validateCart()) {
-      checkoutForm.submit();
+      processPayment();
     }
   });
 }
```
