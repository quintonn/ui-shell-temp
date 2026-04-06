import { bootstrapApp } from "ui-app";
import { DevAppStartupService } from "@/dev-app/services/devAppStartupService";

bootstrapApp(new DevAppStartupService());
