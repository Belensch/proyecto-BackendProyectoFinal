const socket = io();

// Pedido de los Productos
socket.emit("getProductsAdmin");

//  Carga de Productos
socket.on("products", (products) => {
  const container = document.getElementById("products");
  const html = makeProductsTable(products);
  container.innerHTML = html;
});
 

function makeProductsTable(items) {
  const html = items
    .map((item) => {
      return ` <div class="card m-3" style="width: 18rem;">
                <img src='${item.thumbnail}' class="card-img-top">
                <div class="card-body">
                  <h3 class="card-title">${item.title}</h3>
                  <h5 class="card-title">$ ${item.price}</h5>
                  <a href="/admin/update/${item.id}"><button type="button" class="btn btn-primary btnAddToCart" id='${item.id}'>
                    Update
                  </button></a>
                </div>
              </div> `;
    })
    .join(" ");
  return html;
}
