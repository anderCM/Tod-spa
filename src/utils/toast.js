import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

export const showToast = {
  success: (message) => {
    return Toast.fire({
      icon: 'success',
      text: message
    })
  },

  error: (message) => {
    return Toast.fire({
      icon: 'error',
      text: message
    })
  },

  warning: (message) => {
    return Toast.fire({
      icon: 'warning',
      text: message
    })
  },

  info: (message) => {
    return Toast.fire({
      icon: 'info',
      text: message
    })
  },

  loading: (message = 'Cargando...') => {
    return Toast.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }
}

export default showToast