function bindButton(id, onClick) {
  const button = document.getElementById(id);

  if (button) {
    button.addEventListener('click', onClick);
  }
}

export { bindButton };
