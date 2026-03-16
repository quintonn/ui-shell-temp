import { bootstrapApp } from "@/bootstrapper";
import { DevAppStartupService } from "@/dev-app/services/devAppStartupService";

bootstrapApp(new DevAppStartupService());
