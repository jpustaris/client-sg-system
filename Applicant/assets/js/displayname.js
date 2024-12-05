const userDoc = await getDoc(doc(db, "approveusers", user.uid));
if (userDoc.exists()) {
    const username = userDoc.data().username;
    document.getElementById('dropdown-username').textContent = username;
}
