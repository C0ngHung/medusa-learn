import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import type { INotificationModuleService, ICustomerModuleService } from "@medusajs/framework/types"

export default async function customerCreatedHandler ({
    event: { data },
    container,} : SubscriberArgs< { id: string} >) {

    const customerModuleService : ICustomerModuleService = container.resolve(Modules.CUSTOMER);

    const notificationModuleService : INotificationModuleService = container.resolve(Modules.NOTIFICATION);

    const customerId =  data.id;

    let customer;

    try {
        customer = await customerModuleService.retrieveCustomer(customerId);
    } catch (error: any) {
        // Nếu customer không tồn tại -> Bỏ qua an toàn, không retry
        if (error?.type === "not_found" || error?.message?.includes("was not found")) {
            console.log(`[customer-created] Customer ${customerId} not found. Skipping...`)
            return;
        }
        // Lỗi DB/Network khác -> Ném lỗi ra để Redis retry
        throw error;
    }

    // Guard clause: Nếu customer không có email thì không thể gửi email chào mừng
    if (!customer.email) {
        console.log(`[customer-created] Customer ${customerId} has no email. Skipping...`)
        return;
    }

    await notificationModuleService.createNotifications({
        to: customer.email,
        channel: "email",
        template: "customer-welcome",
        data: {customer,},
        // Truyền idempotency_key để đảm bảo tính duy nhất
        idempotency_key: `welcome-customer:${customer.id}:email`,
    } as any )

}

export const config: SubscriberConfig = {

    event: "customer.created",
}