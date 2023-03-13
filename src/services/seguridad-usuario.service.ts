import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Credenciales, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
const generator = require('generate-password');
const MD5 = require("crypto-js/md5");

@injectable({scope: BindingScope.TRANSIENT})
export class SeguridadUsuarioService {
  constructor(
    @repository(UsuarioRepository)
    public repositorioUsuario: UsuarioRepository
  ) {}

  /*
   * crear una clave aleatoria
   * @returns cadena de n caracteras
   */
  crearTextoAleatorio(n:number): string{
    const clave = generator.generate({
      length: n,
      numbers: true
    });
    return clave;
  }
  /**
   * cifrar una cadena con metodo md5
   * @param cadena texto a cifrrar
   * @returns cadena cifrada con md5
   */
  cifrarTexto(cadena:string): string{
    const cadenaCrifrada = MD5(cadena).toString();
    return cadenaCrifrada;
  }
  /**
   * credenciales se busca un usuario por sus credenciales de acceso
   * @param credenciales del usuario
   * @returns usuario encontrado o null
   *
   */
  async identificarUsuario(credenciales: Credenciales): Promise <Usuario | null> {
    const usuario = await this.repositorioUsuario.findOne({
      where:{
        correo: credenciales.correo,
        clave: credenciales.clave
      }
    });
    return usuario as Usuario;
  }
}
