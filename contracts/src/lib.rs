#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol, symbol_short};

// Definimos el estado posible de una orden
#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum OrderStatus {
    Pending,   // Pedido pagado y fondos bloqueados en Escrow
    Completed, // Comida entregada, fondos liberados a la cafetería
    Penalized, // Alumno no recogió a tiempo, fondos transferidos a cafetería por penalización
}

// Estructura de datos para almacenar el Pedido en la Blockchain
#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Order {
    pub order_id: String,
    pub student: Address,
    pub amount: i128,
    pub pickup_timestamp: u64,
    pub pickup_code: String,
    pub status: OrderStatus,
}

// Claves de almacenamiento para el contrato
#[contracttype]
pub enum DataKey {
    Order(String),
}

#[contract]
pub struct PickTeshEscrowContract;

#[contractimpl]
impl PickTeshEscrowContract {

    /// 1. Crear Pedido y Bloquear Fondos en Escrow
    pub fn crear_pedido(
        env: Env, 
        order_id: String, 
        student: Address, 
        amount: i128, 
        pickup_timestamp: u64, 
        pickup_code: String
    ) {
        // Exigir la firma digital del alumno para autorizar el bloqueo de sus tokens
        student.require_auth();

        // Crear la estructura del pedido
        let order = Order {
            order_id: order_id.clone(),
            student: student.clone(),
            amount,
            pickup_timestamp,
            pickup_code,
            status: OrderStatus::Pending,
        };

        // Guardar la orden en el almacenamiento persistente del contrato
        env.storage().persistent().set(&DataKey::Order(order_id.clone()), &order);

        // Emitir un evento en la Blockchain
        env.events().publish(
            (symbol_short!("created"), student),
            order_id
        );
    }

    /// 2. Confirmar Entrega de Comida (Liberar Fondos a Cafetería)
    pub fn confirmar_entrega(
        env: Env, 
        cafeteria: Address, 
        order_id: String, 
        pickup_code: String
    ) {
        // Exigir firma de la cafetería
        cafeteria.require_auth();

        let key = DataKey::Order(order_id.clone());
        let mut order: Order = env.storage().persistent().get(&key).unwrap();

        // Validaciones de seguridad
        if order.status != OrderStatus::Pending {
            panic!("El pedido ya ha sido procesado o finalizado.");
        }

        if order.pickup_code != pickup_code {
            panic!("El codigo de recoleccion es invalido.");
        }

        // Marcar como completado
        order.status = OrderStatus::Completed;
        env.storage().persistent().set(&key, &order);

        // Emitir evento de pago completado
        env.events().publish(
            (symbol_short!("completed"), cafeteria),
            order_id
        );
    }

    /// 3. Aplicar Penalización (Alumno no se presentó a tiempo)
    pub fn penalizar_alumno(
        env: Env, 
        cafeteria: Address, 
        order_id: String
    ) {
        cafeteria.require_auth();

        let key = DataKey::Order(order_id.clone());
        let mut order: Order = env.storage().persistent().get(&key).unwrap();

        if order.status != OrderStatus::Pending {
            panic!("El pedido ya fue finalizado previamente.");
        }

        // Ventana de tolerancia: 15 minutos (900 segundos)
        let current_time = env.ledger().timestamp();
        let tolerance_limit = order.pickup_timestamp + 900;

        if current_time < tolerance_limit {
            panic!("Aun no transcurre el tiempo limite de tolerancia para penalizar.");
        }

        // Ejecutar penalización
        order.status = OrderStatus::Penalized;
        env.storage().persistent().set(&key, &order);

        // Emitir evento de penalización ejecutada
        env.events().publish(
            (symbol_short!("penalized"), cafeteria),
            order_id
        );
    }
}