using System.Diagnostics;

var source = new ActivitySource("MyCompany.MyApp");
using (var activity = source.StartActivity("hello"))
{
    activity?.SetTag("greeting", "world");
}
