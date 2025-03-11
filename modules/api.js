export async function fetchMenu() {
  try {
    const response = await fetch("https://santosnr6.github.io/Data/yumyumproducts.json");
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status}`);
    }
    const data = await response.json();
    console.log(data.items);

    return data.items || [];
  } catch (error) {
    console.log(error.message);
    return [];
  }
}

export async function fetchUsers() {
  try {
    const response = await fetch("https://santosnr6.github.io/Data/yumyumusers.json");
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status}`);
    }
    const data = await response.json();
    console.log(data.users);

    return data.users || [];
  } catch (error) {
    console.log(error.message);
    return [];
  }
}
