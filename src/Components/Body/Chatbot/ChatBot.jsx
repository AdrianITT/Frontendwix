import React,{useEffect, useState} from 'react';
import {getServicioData, createPreCotizacionAll, createPDFPreCotizacion } from './../../../Api/Api';
import { Widget, addResponseMessage, addLinkSnippet, toggleMsgLoader, toggleWidget, deleteMessages } from 'react-chat-widget-react-18';
import 'react-chat-widget-react-18/lib/styles.css';
import './chatbot.css';

function Chatbot() {
  const [step, setStep] = React.useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    empresa: '',
    iva:1,
    fechaSolicitud: '',
    fechaCaducidad: '',
    servicios: [],
  });
  const [servicioActual, setServicioActual] = useState({});
  const hasGreeted = React.useRef(false);
  const [servicioTemporal, setServicioTemporal] = useState({ numero: null, cantidad: null });
  const [servicioAEditar, setServicioAEditar] = useState(null); // puede ser un índice
  const [campoAEditar, setCampoAEditar] = useState(null);
  const [pasoExtra, setPasoExtra] = useState(null); // variable temporal para saber que luego viene la cantidad
  const [servicios, setServicios] = useState([]); // Estado para almacenar los servicios
  const [idCotizacionEnviada, setIdCotizacionEnviada] = useState(null);
  const Organizacion=3;
  const cotizacion =0;



  React.useEffect(() => {
    if (!hasGreeted.current) {
      //toggleWidget();
      addResponseMessage('¡Hola! Soy un chatbot. ¿Quieres crear una cotización?');
      addResponseMessage('Para crear una cotización necesito algunos datos.');
      addResponseMessage("¿Cuál es tu nombre?");
      hasGreeted.current = true;
    }
  }, []);
  
  useEffect(() => {

    
    const fetchServicios = async () => {
      try {
        const response = await getServicioData(Organizacion); // Cambia el ID según sea necesario
        setServicios(response.data);
        //console.log("Servicios:", response.data);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      }
      
    };
    /*setTimeout(() => {
      toggleWidget();

    }, 3000); */

    fetchServicios();
    
  },[]);


  const validacionNombre = (nombre) => {
    const regex = /^([A-Z][a-z]+)(\s[A-Z][a-z]+)*$/;
  return regex.test(nombre) && nombre.length <= 15;
  }
  const validacionApellido = (apellido) => {
    const regex = /^[A-Z][a-zA-Z]{0,13}$/;
    return regex.test(apellido);
  }
  const validacionCorreo = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
  }
  const validacionTelefono = (telefono) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(telefono);
  }
  const validacionEmpresa = (empresa) => {
    const regex = /^[A-Z][a-zA-Z]{0,20}$/;
    return regex.test(empresa);
  }
  /*const validacionFecha = (fecha) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(fecha);
  } */
  const validacionServicio = (servicio) => {
    const regex = /^[0-9]{1,3}$/;
    return regex.test(servicio);
  }
  const validacionCantidad = (cantidad) => {
    const regex = /^[0-9]{1,3}$/;
    return regex.test(cantidad);
  }
  const mostrarResumenServicios = (servicio) => {
    if (!servicio || servicio.length === 0) {
      addResponseMessage('No hay servicios agregados.');
      return;
    }
    //const serviciosTotales = [...servicio, ...nuevosServicios];
    const resumenServicios = generarResumenServicios(servicio, servicios);
    /*const resumen = servicio.map((s, i) =>
      `${i + 1}. Servicio #${s.numero}, Cantidad: ${s.cantidad}`
    ).join('\n'); */
  
    addResponseMessage('Resumen de servicios 2:');
    addResponseMessage(resumenServicios);
    addResponseMessage('Procesando...');
    setTimeout(()=>{
      addResponseMessage('¿Qué deseas hacer ahora?\n1. Agregar más servicios\n2. Editar un servicio\n3. Eliminar un servicio\n4. Continuar con la cotización');
    },3000);
    //addResponseMessage('¿Deseas editar alguno? Escribe el número del servicio en la lista o "no" para continuar.');
  };

  function generarResumenServicios(serviciosTotales, serviciosData) {
    return serviciosTotales.map((s, i) => {
      const info = serviciosData.find(serv => serv.numero === s.numero);
      const nombre = info ? info.nombreServicio : `Servicio #${s.numero}`;
      return `${i + 1}. ${nombre}, Cantidad: ${s.cantidad}`;
    }).join('\n');
  }

  const enviarDatos = async () => {
    try {
      const today = new Date();
      const fechaSolicitud = today.toISOString().split('T')[0];
  
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 30);
      const fechaCaducidad = futureDate.toISOString().split('T')[0];
  
      // Construir payload completo
      const payload = {
        telefonocelular: formData.telefono,
        nombreEmpresa: formData.empresa,
        nombreCliente: formData.nombre,
        apellidoCliente: formData.apellido,
        correo: formData.correo,
        iva: formData.iva,
        fechaSolicitud,
        fechaCaducidad,
        servicios: formData.servicios.map(servicio => {
          const encontrado = servicios.find(s => s.numero === Number(servicio.numero));
          return {
            servicio_id: encontrado?.id,
            cantidad: Number(servicio.cantidad) || 0,
          };
        }),
      };
  
      // Enviar a la nueva vista
      const reponse=await createPreCotizacionAll(payload);
      const dataPC=reponse.data.id;
      console.log("data createPreCotizacionAll:",dataPC);
      setIdCotizacionEnviada(dataPC);
      addResponseMessage("✅ ¡Cotización enviada exitosamente!");
      return dataPC;
    } catch (error) {
      console.error("Error al enviar datos:", error.response?.data || error.message);
      addResponseMessage("❌ Hubo un error al enviar la cotización. Inténtalo de nuevo.");
    }
  };
  

  const handleNewUserMessage = (msg) => {
    if (campoAEditar !== null) {
      let valid = false;
      let nuevoFormData = { ...formData };
    
      switch (campoAEditar) {
        case 1:
          valid = validacionNombre(msg);
          if (valid) nuevoFormData.nombre = msg;
          break;
        case 2:
          valid = validacionApellido(msg);
          if (valid) nuevoFormData.apellido = msg;
          break;
        case 3:
          valid = validacionCorreo(msg);
          if (valid) nuevoFormData.correo = msg;
          break;
        case 4:
          valid = validacionTelefono(msg);
          if (valid) nuevoFormData.telefono = msg;
          break;
        case 5:
          valid = validacionEmpresa(msg);
          if (valid) nuevoFormData.empresa = msg;
          break;
          default:
            addResponseMessage('Opción no válida. Intenta de nuevo.');
            return;
      }
    
      if (!valid) {
        addResponseMessage('Dato inválido. Intenta de nuevo:');
        return;
      }
    
      setFormData(nuevoFormData);
      setCampoAEditar(null); // salimos del modo edición
    
      const resumen = `
    1. Nombre: ${nuevoFormData.nombre}
    2. Apellido: ${nuevoFormData.apellido}
    3. Correo: ${nuevoFormData.correo}
    4. Teléfono: ${nuevoFormData.telefono}
    5. Empresa: ${nuevoFormData.empresa}
      `;
      addResponseMessage('¡Dato actualizado!');
      addResponseMessage('Resumen actualizado:');
      addResponseMessage(resumen);
      addResponseMessage('¿Deseas editar otro dato? Escribe el número o "no" para continuar.');
    
      return;
    }
    const input = msg.trim().toLowerCase();

    // ✅ Cancelar global para ciertos pasos
    const pasosPermitidosCancelar = [9, 91, 92, 93, 94, 95];
    if (input === 'cancelar' && pasosPermitidosCancelar.includes(step)) {
      addResponseMessage('🚫 Proceso cancelado. ¿Quieres volver a empezar? Escribe "inicio".');
      setStep(0);
      return;
    }

    // ✅ Regresar al menú de acciones
    if (input === 'regresar' && [91, 92, 93, 94, 95].includes(step)) {
      addResponseMessage('🔙 Volviendo al menú anterior...');
      addResponseMessage('¿Qué deseas hacer ahora?\n1. Agregar más servicios\n2. Editar un servicio\n3. Eliminar un servicio\n4. Continuar con la cotización\n\nEscribe "cancelar" para salir.');
      setStep(9);
      return;
    }
    
    switch (step) {
      case 0:
        if (!validacionNombre(msg)) {
          addResponseMessage('Por favor, ingresa un nombre válido (inicia con mayúscula y máximo 12 letras).');
          addResponseMessage("¿Cuál es tu nombre?");
          return;
        }
        setFormData({ ...formData, nombre: msg });
        addResponseMessage('¿Cuál es tu apellido paterno?');
        setStep(1);
        break;
      case 1:
        if(!validacionApellido(msg)) {
          addResponseMessage('Por favor, ingresa un apellido válido (inicia con mayúscula y máximo 13 letras).');
          addResponseMessage('¿Cuál es tu apellido paterno?');
          return;
        }
        /*setFormData({ ...formData, apellido: msg });
        addResponseMessage('¿Cuál es tu correo electrónico?');
        setStep(2); */
        setFormData({ ...formData, apellido: msg });
        addResponseMessage('¿Cuál es tu número telefónico?');
        setStep(2);
        break;
      case 2:
        if (!validacionTelefono(msg)) {
          addResponseMessage('Por favor, ingresa un número telefónico válido (10 dígitos).');
          addResponseMessage('¿Cuál es tu número telefónico?');
          return;
        }
        setFormData({ ...formData, telefono: msg });
        addResponseMessage('¿Cuál es tu correo electrónico?');
        setStep(3);
        /*if (!validacionCorreo(msg)) {
          addResponseMessage('Por favor, ingresa un correo electrónico válido.');
          addResponseMessage('¿Cuál es tu correo electrónico?');
          return;
        }
        setFormData({ ...formData, correo: msg });
        addResponseMessage('¿Cuál es tu número telefónico?');
        setStep(3); */
        break;
      case 3:
        if (!validacionCorreo(msg)) {
          addResponseMessage('Por favor, ingresa un correo electrónico válido.');
          addResponseMessage('¿Cuál es tu correo electrónico?');
          return;
        }
        /*if (!validacionTelefono(msg)) {
          addResponseMessage('Por favor, ingresa un número telefónico válido (10 dígitos).');
          addResponseMessage('¿Cuál es tu número telefónico?');
          return;
        } */
        setFormData({ ...formData, correo: msg });
        addResponseMessage('¿Cuál es el nombre de la empresa?(como este registrado ante el sad)');
        setStep(4);
        break;
        case 4:
          if (!validacionEmpresa(msg)) {
            addResponseMessage('Por favor, ingresa un nombre de empresa válido (inicia con mayúscula y máximo 20 letras).');
            addResponseMessage('¿Cuál es el nombre de la empresa?');
            return;
          }
          setFormData({ ...formData, empresa: msg });
          addResponseMessage('¿Qué IVA deseas aplicar?\n1. 8%\n2. 16%\n(Escribe 1 o 2)');
          setStep(41); // nuevo paso para IVA
          break;

          case 41:
            if (msg !== '1' && msg !== '2') {
              addResponseMessage('❌ Opción no válida. Por favor, escribe 1 para 8% o 2 para 16%.');
              return;
            }
            const ivaSeleccionado = msg === '1' ? 1 : 2; // suponiendo que 1=8% y 2=16% en backend
            const updatedForm = { ...formData, iva: ivaSeleccionado };
            setFormData(updatedForm);
          
            // Mostrar resumen
            const resumen = `
          1. Nombre: ${updatedForm.nombre}
          2. Apellido: ${updatedForm.apellido}
          3. Correo: ${updatedForm.correo}
          4. Teléfono: ${updatedForm.telefono}
          5. Empresa: ${updatedForm.empresa}
          6. IVA: ${ivaSeleccionado === 1 ? '8%' : '16%'}
            `;
            addResponseMessage('¡Gracias por completar el formulario!');
            addResponseMessage('¿Deseas editar algún dato antes de enviar? Escribe el número del campo que deseas editar o "no" para continuar.');
            addResponseMessage(resumen);
            setStep(111); // ya definido en tu flujo
            break;
          
        
     case 5:
        if (!validacionEmpresa(msg)) {
          addResponseMessage('Por favor, ingresa un nombre de empresa válido (inicia con mayúscula y máximo 20 letras).');
          addResponseMessage('¿Cuál es el nombre de la empresa?');
          return;
        }
        addLinkSnippet({
          title: 'Ver catálogo de servicios (PDF)',
          link: '/pdf/Catalogo_de_servicios.pdf',
          target: '_blank',
        });
        
        //setFormData({ ...formData, empresa: msg });
        addResponseMessage('Ahora se comenzara a agregar los servicios de la cotizacion');
        addResponseMessage('Escribe el número de servicio:');
        
        
        break;

      case 111:
        //console.log('Campo a editar msg:', msg);
        if (msg.toLowerCase() === 'no') {
          //enviarDatos();
          
          addLinkSnippet({
            title: 'Ver catálogo de servicios (PDF)',
            link: '/pdf/Catalogo_de_servicios.pdf',
            target: '_blank',
          });
          //addResponseMessage('Datos enviados correctamente. ¿Deseas crear otra cotización? (sí/no)');
          addResponseMessage('Ahora se comenzara a agregar los servicios de la cotizacion');
          addResponseMessage('Escribe los numeros de servicio separados por comas (Ejemplo: 1,2,3):');
          setStep(7);
        } else {
          const opcion = parseInt(msg);
          if (isNaN(opcion) || opcion < 1 || opcion > 5) {
            addResponseMessage('Por favor, escribe un número válido entre 1 y 5, o "no" para continuar.');
          } else {
            console.log('Campo a editar:', opcion);
            setCampoAEditar(opcion); // regresa al paso correspondiente
            console.log('Campo a editar:', campoAEditar);
            const preguntas = [
              '¿Cuál es tu nombre?',
              '¿Cuál es tu apellido paterno?',
              '¿Cuál es tu correo electrónico?',
              '¿Cuál es tu número telefónico?',
              '¿Cuál es el nombre de la empresa?'
            ];
            addResponseMessage(`Vamos a corregir el campo ${opcion}:`);
            addResponseMessage(preguntas[opcion -1]);

          }
        }
        //setStep(6);
        break;
      
      case 6:
        addResponseMessage('Ahora comenzaras a agregar los servicios');
        addResponseMessage('Escribe los numeros de servicio separados por comas (Ejemplo: 1,2,3):');
        
        setStep(7);
        return;
        //break;
      case 7:
              // Entrada de varios números de servicio
        const partes = msg.split(',').map(p => p.trim());
        const numeros = [];
        let hayInvalido = false;

        for (let parte of partes) {
          const numero = parseInt(parte, 10);
          if (!/^\d+$/.test(parte) || isNaN(numero)) {
            hayInvalido = true;
            break;
          }
          numeros.push(numero);
        }

        if (hayInvalido) {
          addResponseMessage('❌ Solo se permiten números enteros separados por coma. Intenta de nuevo.');
          return;
        }
        setServicioTemporal({ ...servicioTemporal, numeros }); // guarda varios
        addResponseMessage('¿Cuánto necesita de cada uno? Ingresa las cantidades separadas por comas en el mismo orden.');
        console.log('Paso actual:', step);

        setStep(8);
        console.log('Paso actual:', step);

        break;
      
      case 8:
        // Entrada de varias cantidades
      const partesCantidades = msg.split(',').map(c => c.trim());
        const cantidades = [];
        let hayCantidadInvalida = false;

        for (let parte of partesCantidades) {
          const cantidad = parseInt(parte, 10);
          if (!/^\d+$/.test(parte) || isNaN(cantidad)) {
            hayCantidadInvalida = true;
            break;
          }
          cantidades.push(cantidad);
        }

        if (hayCantidadInvalida) {
          addResponseMessage('❌ Las cantidades deben ser números enteros positivos separados por comas. Intenta de nuevo.');
          return;
        }

        if (cantidades.length !== servicioTemporal.numeros.length) {
          addResponseMessage('❌ El número de cantidades no coincide con el número de servicios seleccionados. Intenta de nuevo.');
          return;
        }

        const nuevosServicios = servicioTemporal.numeros.map((numero, index) => ({
          numero,
          cantidad: cantidades[index]
        }));

        setFormData(prev => ({
          ...prev,
          servicios: [...prev.servicios, ...nuevosServicios]
        }));
        setServicioTemporal({ numeros: [] });
        /*addResponseMessage('¿Quieres agregar más servicios? (sí/no)');
        setStep(9); */
        const serviciosTotales = [...formData.servicios, ...nuevosServicios];
        const resumenServicios = generarResumenServicios(serviciosTotales, servicios);
  
        addResponseMessage('✅ Servicios agregados:');
        addResponseMessage(resumenServicios);
        addResponseMessage('Procesando...');
        toggleMsgLoader();
        setTimeout(() => {
          toggleMsgLoader();
        addResponseMessage('¿Qué deseas hacer ahora?\n1. Agregar más servicios\n2. Editar un servicio\n3. Eliminar un servicio\n4. Continuar con la cotización');
        },3000);
        setStep(9);
        break;
        
        case 9:
          switch (msg.trim()) {
            case '1':
              addResponseMessage('Dime qué número(s) de servicio quieres agregar.');
              setStep(7); // Paso para seleccionar más servicios
              break;
            case '2':
              const resumen = generarResumenServicios(formData.servicios, servicios);
              addResponseMessage('Servicios actuales:');
              addResponseMessage(resumen);
              addResponseMessage('Escribe el número del servicio que deseas editar:');
              setStep(91); // Paso de edición
              break;
            case '3':
              const resumenDel = generarResumenServicios(formData.servicios, servicios);
              addResponseMessage('Servicios actuales:');
              addResponseMessage(resumenDel);
              addResponseMessage('Escribe el número del servicio que deseas eliminar:');
              setStep(95); // Paso de eliminación
              break;
            case '4':
              const resumenFinal = generarResumenServicios(formData.servicios, servicios);
              addResponseMessage('Resumen final de servicios:');
              addResponseMessage(resumenFinal);
              addResponseMessage('¿Confirmas que deseas enviar la cotización? (sí/no)');
              setStep(10); // Paso final para confirmar y enviar
              break;
            default:
              addResponseMessage('Por favor ingresa una opción válida (1, 2, 3 o 4).');
              break;
          }
        break;

        case 96:
          if (msg.trim().toLowerCase() === 'cancelar') {
            addResponseMessage('🚫 Proceso cancelado. ¿Quieres empezar de nuevo? Escribe "inicio".');
            setStep(0);
            return;
          }else if (msg.trim().toLowerCase() === 'continuar') {
            addResponseMessage('Dime qué número(s) de servicio quieres agregar.');
            setStep(9);
            return;
          }
          break;

        case 91:
            if (msg.toLowerCase() === 'no') {
            /*enviarDatos();
            setStep(999);
            addResponseMessage('¡Cotización enviada!');
            addResponseMessage('¿Deseas crear otra cotización? (sí/no)');
            setStep(10); */
            const resumen = generarResumenServicios(formData.servicios, servicios);
            addResponseMessage('Servicios actuales:');
            addResponseMessage(resumen);
            addResponseMessage('¿Deseas eliminar algún servicio? Escribe el número o "no" para continuar.');
            setStep(10); // paso especial para eliminación
            return;
            }

            const indice = parseInt(msg) - 1;
            if (!isNaN(indice) && formData.servicios[indice]) {
            setServicioAEditar(indice);
            addResponseMessage(`¿Qué deseas editar del servicio #${formData.servicios[indice].numero}? (escribe: número o cantidad )`);
            setStep(92);
            } else {
            addResponseMessage('Entrada no válida. Escribe el número del servicio a editar o "no" para continuar.');
            }
            break;

        case 92:
          const opcion = msg.toLowerCase();
          if (opcion === 'número' || opcion === 'numero') {
            addResponseMessage('Escribe el nuevo número del servicio:');
            setStep(93);
          } else if (opcion === 'cantidad') {
            addResponseMessage('Escribe la nueva cantidad del servicio:');
            setStep(94);
          } else if (opcion === 'ambos') {
            setPasoExtra('cantidad'); // variable temporal para saber que luego viene la cantidad
            addResponseMessage('Escribe el nuevo número del servicio:');
            setStep(93);
          } else {
            addResponseMessage('Opción no válida. Escribe: número, cantidad o ambos.');
          }
          
          break;
        
        case 93:
          const nuevoNumero = parseInt(msg);
          console.log('Nuevo número:', nuevoNumero);
          if (isNaN(nuevoNumero) || nuevoNumero <= 0) {
            addResponseMessage('Número inválido. Ingresa un número mayor a 0.');
            return;
          }
          console.log('Servicio a editar1:', servicioAEditar);
          if (
            servicioAEditar === null ||
            isNaN(servicioAEditar) ||
            servicioAEditar < 0 ||
            servicioAEditar >= formData.servicios.length
          ) {
            addResponseMessage('Error interno: no se pudo identificar el servicio a editar.');
            setStep(91); // volver a lista de servicios
            return;
          }
          console.log('Servicio a editar2:', servicioAEditar);
          const serviciosEditados = [...formData.servicios];
          serviciosEditados[servicioAEditar] = {
            ...serviciosEditados[servicioAEditar],
            numero: nuevoNumero,
          };
          console.log('Servicios editados3:', serviciosEditados);
          setFormData({ ...formData, servicios: serviciosEditados });
          console.log('Servicios editados4:', serviciosEditados);  
          if (pasoExtra === 'cantidad') {
            setPasoExtra(null);
            setStep(94);
            addResponseMessage('Escribe la nueva cantidad del servicio:');
          } else {
            setServicioAEditar(null);
            addResponseMessage('¡Servicio actualizado!1');
            mostrarResumenServicios(serviciosEditados);
            setStep(9);
          }

          break;
        
        case 94:
          const nuevaCantidad = parseInt(msg);
          if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
            addResponseMessage('Cantidad inválida. Ingresa un número mayor a 0.');
            return;
          }

          const serviciosActualizados = [...formData.servicios];
          serviciosActualizados[servicioAEditar].cantidad = nuevaCantidad;
          setFormData({ ...formData, servicios: serviciosActualizados });

          setServicioAEditar(null);
          addResponseMessage('¡Cantidad actualizada!');
          mostrarResumenServicios(serviciosActualizados);
          setStep(9);

          break;

        case 95:
          const indiceEliminar = parseInt(msg) - 1;
          if (!isNaN(indiceEliminar) && formData.servicios[indiceEliminar]) {
            const servicioEliminado = formData.servicios[indiceEliminar];
            const serviciosActualizados = [...formData.servicios];
            serviciosActualizados.splice(indiceEliminar, 1);

            setFormData(prev => ({
              ...prev,
              servicios: serviciosActualizados
            }));

            addResponseMessage(`🗑️ Servicio #${servicioEliminado.numero} eliminado.`);
            const resumenActualizado = generarResumenServicios(serviciosActualizados, servicios);
            addResponseMessage('Servicios restantes:');
            addResponseMessage(resumenActualizado);
            addResponseMessage('Procesando...');
            setTimeout(()=>{
            addResponseMessage('¿Qué deseas hacer ahora?\n1. Agregar más servicios\n2. Editar un servicio\n3. Eliminar un servicio\n4. Continuar con la cotización');
            },3000);
            setStep(9);
          } else {
            addResponseMessage('Número inválido. Intenta nuevamente.');
          }
          break;

          case 10:
            if (msg.toLowerCase() === 'si') {
              enviarDatos().then((idPreCotizacionGenerada) => {
                setIdCotizacionEnviada(idPreCotizacionGenerada); // guarda el ID para generar el PDF después
                addResponseMessage('✅ ¡Gracias por crear la cotización con nosotros!');
                addResponseMessage('¿Deseas descargar el PDF de la cotización? (sí/no)');
                setStep(101); // nuevo paso para confirmar descarga
              });
              return;
            } else if (msg.toLowerCase() === 'no') {
              addResponseMessage('¡Gracias por usar nuestro servicio!');
              addResponseMessage('¿Deseas crear otra cotización? (sí/no)');
              setStep(11);
              return;
            }
            break;

            case 101:
              if (msg.toLowerCase() === 'si') {
                if (!idCotizacionEnviada) {
                  addResponseMessage('❌ No se pudo generar el PDF. Inténtalo más tarde.');
                  addResponseMessage('¿Deseas crear otra cotización? (sí/no)');
                  setStep(11);
                  return;
                }
                fetch(`http://127.0.0.1:8000/api/precotizacion/${idCotizacionEnviada}/pdf/`)
                .then(res => res.blob())
                .then(blob => {
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `cotizacion_${idCotizacionEnviada}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);

                  addResponseMessage('📄 PDF descargado automáticamente.');
                  addResponseMessage('¿Deseas crear otra cotización? (sí/no)');
                  setStep(11);
                })
                .catch(() => {
                  addResponseMessage('❌ Error al descargar el PDF.');
                  setStep(11);
                });

              
              
              } else if (msg.toLowerCase() === 'no') {
                addResponseMessage('¿Deseas crear otra cotización? (sí/no)');
                setStep(11);
              } else {
                addResponseMessage('Por favor, responde con "sí" o "no".');
              }
              break;

        
      case 11:
        if (msg.toLowerCase() === 'sí' || msg.toLowerCase() === 'si') {
          deleteMessages();
          setFormData({
            nombre: '',
            apellido: '',
            correo: '',
            telefono: '',
            empresa: '',
            fechaSolicitud: '',
            fechaCaducidad: '',
            servicios: [],
          });
          setServicioActual({});
          addResponseMessage("Perfecto. ¿Cuál es tu nombre?");
          setStep(0);
        } else {
          addResponseMessage('¡Gracias por usar nuestro servicio!');
          setStep(12);
        }
        break;

        case 12:
        // Si el usuario escribe cualquier cosa, reinicia el flujo
        deleteMessages();
        setFormData({
          nombre: '',
          apellido: '',
          correo: '',
          telefono: '',
          empresa: '',
          fechaSolicitud: '',
          fechaCaducidad: '',
          servicios: [],
        });
        setServicioActual({});
        addResponseMessage("¡Hola de nuevo! Para comenzar, ¿cuál es tu nombre?");
        setStep(0);
        break;
      
        default:
        addResponseMessage('Ya hemos terminado. ¡Gracias!');
    }
  };

  return (
    <div className="chatbot">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Chat De Cotizacion"
        subtitle="Estamos para ayudarte"
      />
    </div>
  );
}

export default Chatbot;
