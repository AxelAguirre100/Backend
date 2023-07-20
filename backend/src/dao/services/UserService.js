import userModel from "../../dao/models/MongoDB/userModel.js";
import { sendDeleteUserNotification } from "../../utils/email.js";

export async function findUsers() {
  try {
    const usuarios = await userModel.find({}, "first_name email rol");
    const nombresYEmails = usuarios.map((usuario) => {
      return {
        first_name: usuario.first_name,
        email: usuario.email,
        rol: usuario.rol
      };
    });
    return nombresYEmails;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteInactiveUsers() {
  try {
    const dosDiasAtras = new Date();
    dosDiasAtras.setDate(dosDiasAtras.getDate() - 2);
    const usuariosInactivos = await userModel.find({
      last_login: { $lt: dosDiasAtras }
    });
    const emailsUsuariosInactivos = usuariosInactivos.map(usuario => usuario.email);
    await sendDeleteUserNotification(emailsUsuariosInactivos)
    const resultado = await userModel.deleteMany({
      last_login: { $lt: dosDiasAtras }
    });
    return {
      resultado,
      emailsUsuariosInactivos
    }
  } catch (error) {
    throw new Error(error);
  }
}

export const findUserById = async (id) => {
  try {
    const user = await userModel.findById(id)
    return user
  } catch (error) {
    throw new Error(error);
  }
}

export const findUserByEmail = async (email) => {
  try {
    const user = await userModel.findOne({ email: email })
    return user
  } catch (error) {
    throw new Error(error);
  }
}

export const createUser = async (user) => {
  try {
    const newUser = await userModel(user)
    await newUser.save()
    return newUser
  } catch (error) {
    throw new Error(error);
  }
}